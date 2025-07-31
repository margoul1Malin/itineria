import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateTwoFactorCode, sendTwoFactorEmail, verifyTwoFactorCode } from '@/lib/twoFactor'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

// POST - Changer le mot de passe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Ancien et nouveau mot de passe requis' }, { status: 400 })
    }

    // Vérifier l'authentification avec JWT
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = session.value
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        isActive: true 
      },
      select: { id: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Ancien mot de passe incorrect' }, { status: 400 })
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' })
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Configurer l'authentification à 2 facteurs
export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { action, code } = body // action: 'enable', 'disable', 'verify'

    const token = session.value
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        isActive: true 
      },
      select: { id: true, email: true, username: true, twoFactorSecret: true, twoFactorEnabled: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (action === 'enable') {
      // Générer un code 2FA et l'envoyer par email
      const twoFactorCode = generateTwoFactorCode()
      
      // Stocker temporairement le code
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          twoFactorSecret: twoFactorCode,
          twoFactorEnabled: false // Pas encore activé jusqu'à vérification
        }
      })

      // Envoyer le code par email
      await sendTwoFactorEmail(user.email, twoFactorCode, user.username)

      return NextResponse.json({ 
        message: 'Code 2FA envoyé par email. Vérifiez votre boîte de réception.'
      })
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ error: 'Code requis' }, { status: 400 })
      }

      // Vérifier le code 2FA
      if (verifyTwoFactorCode(code, user.twoFactorSecret || '')) {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            twoFactorEnabled: true,
            twoFactorVerified: true,
            emailVerified: true, // Marquer l'email comme vérifié car l'utilisateur a reçu le code
            twoFactorSecret: null // Nettoyer le code temporaire
          }
        })

        return NextResponse.json({ message: '2FA activé avec succès' })
      } else {
        return NextResponse.json({ error: 'Code incorrect' }, { status: 400 })
      }
    }

    if (action === 'disable') {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          twoFactorEnabled: false,
          twoFactorVerified: false,
          twoFactorSecret: null
        }
      })

      return NextResponse.json({ message: '2FA désactivé avec succès' })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (error) {
    console.error('Erreur lors de la configuration 2FA:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Demander la suppression du compte
export async function DELETE(request: NextRequest) {
  try {
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = session.value
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const body = await request.json()
    const { password, reason } = body

    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur connecté
    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        isActive: true 
      },
      select: { 
        id: true, 
        password: true, 
        email: true, 
        username: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 400 })
    }

    // Calculer l'âge du compte
    const accountAgeInDays = Math.floor((new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Sauvegarder les données de suppression avant de supprimer le compte
    await (prisma as unknown as { accountDeletion: { create: (args: unknown) => Promise<unknown> } }).accountDeletion.create({
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        reason: reason || null,
        accountAge: accountAgeInDays,
        lastLogin: user.lastLogin
      }
    })

    // Supprimer définitivement le compte utilisateur
    await prisma.user.delete({
      where: { id: user.id }
    })

    console.log(`Compte supprimé définitivement pour l'utilisateur ${user.username} (${user.email})`, {
      userId: user.id,
      reason: reason || 'Aucune raison fournie',
      accountAge: accountAgeInDays,
      deletedAt: new Date()
    })

    // Créer une réponse qui supprime aussi le cookie de session
    const response = NextResponse.json({ 
      message: 'Votre compte a été supprimé définitivement.',
      success: true
    })

    // Supprimer le cookie de session pour déconnecter l'utilisateur
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immédiatement
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Erreur lors de la demande de suppression:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 