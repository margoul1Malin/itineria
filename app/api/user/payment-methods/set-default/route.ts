import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

// PUT - Définir une carte comme carte par défaut
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
    const { paymentMethodId } = body

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'ID du moyen de paiement requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur et ses moyens de paiement
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

    // Vérifier que le moyen de paiement existe
    const currentPaymentMethods = (user.paymentMethods as Array<{
      id: string;
      type: string;
      maskedNumber: string;
      expiryDate: string;
      cardholderName: string;
      isDefault: boolean;
      createdAt: string;
    }>) || []

    const paymentMethodExists = currentPaymentMethods.some(method => method.id === paymentMethodId)
    if (!paymentMethodExists) {
      return NextResponse.json({ error: 'Moyen de paiement non trouvé' }, { status: 404 })
    }

    // Mettre à jour tous les moyens de paiement : désactiver tous les isDefault et activer celui sélectionné
    const updatedPaymentMethods = currentPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === paymentMethodId
    }))

    // Mettre à jour en base
    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethods: updatedPaymentMethods }
    })

    return NextResponse.json({ 
      message: 'Carte par défaut mise à jour avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte par défaut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 