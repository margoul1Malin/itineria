import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
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

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        currency: true,
        language: true,
        twoFactorEnabled: true,
        twoFactorVerified: true,
        emailVerified: true,
        paymentMethods: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
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
    const { firstName, lastName, phone, currency, language } = body

    // Validation des données
    if (currency && !['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'].includes(currency)) {
      return NextResponse.json({ error: 'Devise invalide' }, { status: 400 })
    }

    if (language && !['fr', 'en', 'de'].includes(language)) {
      return NextResponse.json({ error: 'Langue invalide' }, { status: 400 })
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: {
        id: payload.userId
      },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        currency: currency || undefined,
        language: language || undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        currency: true,
        language: true,
        twoFactorEnabled: true,
        twoFactorVerified: true,
        emailVerified: true,
        paymentMethods: true,
        createdAt: true,
        lastLogin: true
      }
    })

    return NextResponse.json({ user: updatedUser, message: 'Profil mis à jour avec succès' })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 