import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()



// GET - Récupérer les analytics des suppressions de compte
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const token = session.value
    const payload = verifyToken(token)
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Accès refusé - Droits administrateur requis' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // Nombre de jours par défaut

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Récupérer les statistiques de suppression depuis le nouveau modèle
    const deletionStats = await (prisma as unknown as { accountDeletion: { findMany: (args: unknown) => Promise<unknown[]> } }).accountDeletion.findMany({
      where: {
        deletedAt: {
          gte: startDate
        }
      },
      orderBy: {
        deletedAt: 'desc'
      }
    }) as Array<{
      id: string;
      userId: string;
      username: string;
      email: string;
      reason: string | null;
      deletedAt: Date;
      accountAge: number;
      lastLogin: Date | null;
    }>

    // Analyser les raisons par fréquence
    const reasonsStats = deletionStats.reduce((acc: { [key: string]: number }, deletion) => {
      const reason = deletion.reason || 'Aucune raison fournie'
      acc[reason] = (acc[reason] || 0) + 1
      return acc
    }, {})

    // Convertir en array et trier par fréquence
    const reasonsArray = Object.entries(reasonsStats)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)

    // Calculer des métriques supplémentaires
    const totalDeletions = deletionStats.length
    const deletionsByMonth = deletionStats.reduce((acc: { [key: string]: number }, deletion) => {
      const month = deletion.deletedAt.toISOString().substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    // Calculer la durée moyenne avant suppression (déjà calculée et stockée)
    const averageAccountAge = deletionStats.reduce((sum, deletion) => {
      return sum + deletion.accountAge
    }, 0) / Math.max(totalDeletions, 1)

    return NextResponse.json({
      summary: {
        totalDeletions,
        period: `${period} derniers jours`,
        averageAccountAgeBeforeDeletion: Math.round(averageAccountAge)
      },
      reasonsStats: reasonsArray,
      deletionsByMonth: Object.entries(deletionsByMonth)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      recentDeletions: deletionStats.slice(0, 10).map(deletion => ({
        id: deletion.id,
        userId: deletion.userId,
        username: deletion.username,
        email: deletion.email,
        reason: deletion.reason || 'Aucune raison fournie',
        deletedAt: deletion.deletedAt,
        accountAge: deletion.accountAge,
        lastLogin: deletion.lastLogin
      }))
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 