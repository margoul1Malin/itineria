import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/jwt'
import { generateTwoFactorCode, sendTwoFactorEmail } from '@/lib/twoFactor'
import crypto from 'crypto'

const prisma = new PrismaClient()

// POST - Connexion utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Rechercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        isActive: true,
        role: true,
        twoFactorEnabled: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Compte désactivé' }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Si l'utilisateur a la 2FA activée
    if (user.twoFactorEnabled) {
      // Générer un code 2FA temporaire
      const twoFactorCode = generateTwoFactorCode()
      const tempSessionId = crypto.randomBytes(32).toString('hex')
      
      // Stocker temporairement le code et l'ID de session
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          twoFactorSecret: twoFactorCode,
          lastLogin: new Date()
        }
      })

      // Envoyer le code par email
      await sendTwoFactorEmail(user.email, twoFactorCode, user.username)

      return NextResponse.json({
        requiresTwoFactor: true,
        tempSessionId,
        message: 'Code de vérification envoyé par email'
      })
    }

    // Connexion normale (sans 2FA)
    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Générer le token JWT
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }

    const token = generateToken(tokenPayload)

    // Créer la réponse
    const response = NextResponse.json({ 
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

    // Définir le cookie de session avec JWT
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return response
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 