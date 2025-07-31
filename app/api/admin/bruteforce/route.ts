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

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Construction du filtre
    let where = {}
    if (filter === 'blocked') {
      where = { isBlocked: true }
    } else if (filter === 'active') {
      where = { isBlocked: false }
    }

    // Récupération des tentatives
    const [attempts, total] = await Promise.all([
      prisma.bruteforceAttempt.findMany({
        where,
        orderBy: { lastAttempt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          ip: true,
          userAgent: true,
          fingerprint: true,
          attempts: true,
          isBlocked: true,
          blockedUntil: true,
          lastAttempt: true,
          browser: true,
          os: true,
          device: true,
          headers: true
        }
      }),
      prisma.bruteforceAttempt.count({ where })
    ])

    return NextResponse.json({
      attempts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des tentatives:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 