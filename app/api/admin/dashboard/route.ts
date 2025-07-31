import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les statistiques des contacts
    const [totalContacts, pendingContacts, processedContacts] = await Promise.all([
      prisma.contactQuery.count(),
      prisma.contactQuery.count({ where: { status: 'pending' } }),
      prisma.contactQuery.count({ 
        where: { 
          OR: [
            { status: 'processed' },
            { status: 'resolved' }
          ]
        } 
      })
    ])

    // Récupérer les statistiques des tentatives de bruteforce
    const [totalAttempts, blockedAttempts] = await Promise.all([
      prisma.bruteforceAttempt.count(),
      prisma.bruteforceAttempt.count({ where: { isBlocked: true } })
    ])

    // Récupérer les contacts récents
    const recentContacts = await prisma.contactQuery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true
      }
    })

    // Récupérer les tentatives récentes
    const recentAttempts = await prisma.bruteforceAttempt.findMany({
      orderBy: { lastAttempt: 'desc' },
      take: 5,
      select: {
        id: true,
        ip: true,
        browser: true,
        os: true,
        device: true,
        attempts: true,
        isBlocked: true,
        lastAttempt: true
      }
    })

    return NextResponse.json({
      totalContacts,
      pendingContacts,
      processedContacts,
      totalBruteforceAttempts: totalAttempts,
      blockedAttempts,
      recentContacts,
      recentAttempts
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 