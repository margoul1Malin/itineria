import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'
import { generateToken } from '@/lib/jwt'
import crypto from 'crypto'

const prisma = new PrismaClient()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''

// POST - Authentification Google
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json({ error: 'Token Google requis' }, { status: 400 })
    }

    // Vérifier le token Google
    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.json({ error: 'Token Google invalide' }, { status: 401 })
    }

    const { email, name } = payload

    if (!email) {
      return NextResponse.json({ error: 'Email requis pour l\'authentification' }, { status: 400 })
    }

    // Rechercher l'utilisateur par email
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    })

    if (!user) {
      // Créer un nouvel utilisateur
      const [firstName, ...lastNameParts] = (name || 'Utilisateur').split(' ')
      const lastName = lastNameParts.join(' ') || ''
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5)

      // Générer un mot de passe sécurisé pour les utilisateurs Google
      const googlePassword = crypto.randomBytes(32).toString('hex')
      
      user = await prisma.user.create({
        data: {
          email,
          username,
          firstName,
          lastName,
          password: googlePassword, // Mot de passe requis mais non utilisé pour Google OAuth
          role: 'user',
          isActive: true,
          currency: 'EUR',
          language: 'fr'
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true
        }
      })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Compte désactivé' }, { status: 401 })
    }

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
      message: 'Connexion Google réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

    // Définir le cookie de session
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return response
  } catch (error) {
    console.error('Erreur lors de l\'authentification Google:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 