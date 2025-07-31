import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
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

    const user = await prisma.user.findFirst({
      where: { isActive: true },
      select: { id: true, twoFactorSecret: true, twoFactorEnabled: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (action === 'enable') {
      // Générer un secret pour la 2FA
      const secret = crypto.randomBytes(20).toString('hex')
      
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          twoFactorSecret: secret,
          twoFactorEnabled: false // Pas encore activé jusqu'à vérification
        }
      })

      return NextResponse.json({ 
        message: '2FA configuré, veuillez vérifier avec le code',
        secret 
      })
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ error: 'Code requis' }, { status: 400 })
      }

      // Ici vous devriez vérifier le code avec une bibliothèque TOTP
      // Pour l'instant, on simule la vérification
      if (code === '123456') { // Code de test
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            twoFactorEnabled: true,
            twoFactorVerified: true
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

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findFirst({
      where: { isActive: true },
      select: { id: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 400 })
    }

    // Marquer la demande de suppression
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        deletionRequested: true,
        deletionRequestedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Demande de suppression enregistrée. Votre compte sera supprimé dans 30 jours.' 
    })
  } catch (error) {
    console.error('Erreur lors de la demande de suppression:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 