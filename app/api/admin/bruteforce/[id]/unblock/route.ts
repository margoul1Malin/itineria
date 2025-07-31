import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(
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

    // Vérifier que la tentative existe
    const attempt = await prisma.bruteforceAttempt.findUnique({
      where: { id }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Tentative non trouvée' },
        { status: 404 }
      )
    }

    // Débloquer la tentative
    await prisma.bruteforceAttempt.update({
      where: { id },
      data: {
        isBlocked: false,
        blockedUntil: null,
        attempts: 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tentative débloquée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors du déblocage:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du déblocage' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 