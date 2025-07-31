import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateAdmin(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Vérifier que la demande existe
    const contact = await prisma.contactQuery.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Demande de contact non trouvée' },
        { status: 404 }
      )
    }

    // Validation du statut
    const validStatuses = ['pending', 'processed', 'resolved', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut
    await prisma.contactQuery.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Statut mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 