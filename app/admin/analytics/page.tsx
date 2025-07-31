"use client"
import { useState, useEffect } from 'react'

interface DeletionReason {
  reason: string
  count: number
}

interface DeletionByMonth {
  month: string
  count: number
}

interface RecentDeletion {
  id: string
  userId: string
  username: string
  email: string
  reason: string
  deletedAt: string
  accountAge: number
  lastLogin: string | null
}

interface AnalyticsData {
  summary: {
    totalDeletions: number
    period: string
    averageAccountAgeBeforeDeletion: number
  }
  reasonsStats: DeletionReason[]
  deletionsByMonth: DeletionByMonth[]
  recentDeletions: RecentDeletion[]
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('30')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (selectedPeriod: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      } else {
        setError('Erreur lors du chargement des analytics')
      }
    } catch (err) {
      console.log('Erreur lors du chargement des analytics:', err)
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(period)
  }, [period])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics de Suppression</h1>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
          <option value="180">6 derniers mois</option>
          <option value="365">1 an</option>
        </select>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Suppressions</h3>
          <p className="text-3xl font-bold text-red-600">{analyticsData.summary.totalDeletions}</p>
          <p className="text-sm text-gray-500">{analyticsData.summary.period}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Âge Moyen du Compte</h3>
          <p className="text-3xl font-bold text-blue-600">{analyticsData.summary.averageAccountAgeBeforeDeletion}</p>
          <p className="text-sm text-gray-500">jours avant suppression</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Principales Raisons</h3>
          <p className="text-3xl font-bold text-green-600">{analyticsData.reasonsStats.length}</p>
          <p className="text-sm text-gray-500">raisons différentes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raisons de suppression */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Raisons de Suppression</h2>
          </div>
          <div className="p-6">
            {analyticsData.reasonsStats.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.reasonsStats.map((reason, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{reason.reason}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(reason.count / analyticsData.summary.totalDeletions) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-lg font-bold text-gray-700">{reason.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune suppression sur cette période</p>
            )}
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Évolution Mensuelle</h2>
          </div>
          <div className="p-6">
            {analyticsData.deletionsByMonth.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.deletionsByMonth.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(month.month + '-01').toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.max((month.count / Math.max(...analyticsData.deletionsByMonth.map(m => m.count))) * 100, 5)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-8">{month.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée mensuelle</p>
            )}
          </div>
        </div>
      </div>

      {/* Suppressions récentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Suppressions Récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge du compte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de suppression
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.recentDeletions.map((deletion) => (
                <tr key={deletion.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deletion.username}</div>
                      <div className="text-sm text-gray-500">{deletion.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {deletion.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deletion.accountAge} jours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(deletion.deletedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 