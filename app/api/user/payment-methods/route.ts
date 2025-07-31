import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

// GET - Récupérer les moyens de paiement
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

    // Récupérer l'utilisateur et ses moyens de paiement
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
        isActive: true
      },
      select: {
        id: true,
        paymentMethods: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ 
      paymentMethods: user.paymentMethods || [] 
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des moyens de paiement:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter un moyen de paiement
export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { type, cardNumber, expiryDate, cardholderName } = body

    // Validation des données
    if (!type || !cardNumber || !expiryDate || !cardholderName) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const token = session.value
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Récupérer les moyens de paiement existants
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
        isActive: true
      },
      select: { id: true, paymentMethods: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Ajouter aux moyens de paiement existants
    const currentPaymentMethods = (user.paymentMethods as Array<{
      id: string;
      type: string;
      maskedNumber: string;
      expiryDate: string;
      cardholderName: string;
      isDefault: boolean;
      createdAt: string;
    }>) || []

    // Créer le nouveau moyen de paiement (sans CVV pour des raisons de sécurité)
    const newPaymentMethod = {
      id: Date.now().toString(),
      type,
      maskedNumber: `**** **** **** ${cardNumber.slice(-4)}`,
      expiryDate,
      cardholderName,
      isDefault: currentPaymentMethods.length === 0, // Première carte = carte par défaut
      createdAt: new Date().toISOString(),
      // Note: CVV non stocké pour des raisons de sécurité PCI DSS
      // Le CVV sera demandé à chaque utilisation pour les paiements
    }
    const updatedPaymentMethods = [...currentPaymentMethods, newPaymentMethod]

    // Mettre à jour en base
    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethods: updatedPaymentMethods }
    })

    return NextResponse.json({ 
      message: 'Moyen de paiement ajouté avec succès',
      paymentMethod: newPaymentMethod
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout du moyen de paiement:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un moyen de paiement
export async function DELETE(request: NextRequest) {
  try {
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentMethodId = searchParams.get('id')

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'ID du moyen de paiement requis' }, { status: 400 })
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
      select: { id: true, paymentMethods: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Supprimer le moyen de paiement
    const currentPaymentMethods = (user.paymentMethods as Array<{
      id: string;
      type: string;
      maskedNumber: string;
      expiryDate: string;
      cardholderName: string;
      isDefault: boolean;
      createdAt: string;
    }>) || []
    const updatedPaymentMethods = currentPaymentMethods.filter(
      (method) => method.id !== paymentMethodId
    )

    // Mettre à jour en base
    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethods: updatedPaymentMethods }
    })

    return NextResponse.json({ 
      message: 'Moyen de paiement supprimé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du moyen de paiement:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 