import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateToken } from '@/lib/jwt'
import { verifyTwoFactorCode } from '@/lib/twoFactor'

const prisma = new PrismaClient()

// POST - Vérifier le code 2FA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, tempSessionId } = body

    if (!code || !tempSessionId) {
      return NextResponse.json({ error: 'Code et session requis' }, { status: 400 })
    }

    // Rechercher l'utilisateur avec le code 2FA temporaire
    const user = await prisma.user.findFirst({
      where: { 
        twoFactorSecret: code,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorSecret: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Code incorrect ou expiré' }, { status: 401 })
    }

    // Vérifier le code 2FA
    if (!verifyTwoFactorCode(code, user.twoFactorSecret || '')) {
      return NextResponse.json({ error: 'Code incorrect' }, { status: 401 })
    }

    // Nettoyer le code temporaire
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFactorSecret: null,
        lastLogin: new Date()
      }
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
    console.error('Erreur lors de la vérification 2FA:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 