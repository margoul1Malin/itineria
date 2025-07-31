import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

// GET - Exporter les données utilisateur
export async function GET(request: NextRequest) {
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

    // Récupérer toutes les données utilisateur
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
        lastLogin: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Formater les données pour l'export
    let paymentMethods: { maskedNumber: string; [key: string]: unknown }[] = []
    if (user.paymentMethods) {
      try {
        // Si c'est déjà un objet (cas où Prisma a automatiquement parsé le JSON)
        if (typeof user.paymentMethods === 'object' && Array.isArray(user.paymentMethods)) {
          paymentMethods = user.paymentMethods as { maskedNumber: string; [key: string]: unknown }[]
        } else if (typeof user.paymentMethods === 'string') {
          // Si c'est une chaîne JSON
          paymentMethods = JSON.parse(user.paymentMethods) as { maskedNumber: string; [key: string]: unknown }[]
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing des moyens de paiement:', parseError)
        paymentMethods = []
      }
    }

    const exportData = {
      user: {
        ...user,
        // Masquer les données sensibles
        paymentMethods: paymentMethods.map((method: { maskedNumber: string; [key: string]: unknown }) => ({
          ...method,
          maskedNumber: method.maskedNumber // Déjà masqué
        }))
      },
      exportDate: new Date().toISOString(),
      exportInfo: {
        format: 'JSON',
        version: '1.0',
        description: 'Données utilisateur exportées depuis Itineria'
      }
    }

    // Créer la réponse avec les headers pour le téléchargement
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="itineria-user-data-${user.username}-${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    console.error('Erreur lors de l\'export des données:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 