"use client"
import { useState, useEffect } from 'react'

interface BruteforceAttempt {
  id: string
  ip: string
  userAgent: string
  fingerprint: string
  attempts: number
  isBlocked: boolean
  blockedUntil: string | null
  lastAttempt: string
  browser: string | null
  os: string | null
  device: string | null
  headers: Record<string, string>
}

export default function AdminBruteforce() {
  const [attempts, setAttempts] = useState<BruteforceAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedAttempt, setSelectedAttempt] = useState<BruteforceAttempt | null>(null)

  useEffect(() => {
    fetchAttempts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, currentPage])

  const fetchAttempts = async () => {
    try {
      const params = new URLSearchParams({
        filter: selectedFilter,
        page: currentPage.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/bruteforce?${params}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAttempts(data.attempts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tentatives:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const unblockAttempt = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/bruteforce/${id}/unblock`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        // Mettre à jour la liste
        setAttempts(prev => prev.map(attempt => 
          attempt.id === id ? { ...attempt, isBlocked: false, blockedUntil: null } : attempt
        ))
      }
    } catch (error) {
      console.error('Erreur lors du déblocage:', error)
    }
  }

  const deleteAttempt = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tentative ?')) return

    try {
      const response = await fetch(`/api/admin/bruteforce/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Retirer de la liste
        setAttempts(prev => prev.filter(attempt => attempt.id !== id))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const getStatusColor = (isBlocked: boolean) => {
    return isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  const getStatusLabel = (isBlocked: boolean) => {
    return isBlocked ? 'Bloqué' : 'Autorisé'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Surveillance de sécurité</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Tentatives de connexion et protection anti-bruteforce</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Toutes les tentatives</option>
            <option value="blocked">Bloquées</option>
            <option value="active">Actives</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-red-100 text-red-600">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Tentatives bloquées</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {attempts.filter(a => a.isBlocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total tentatives</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">{attempts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Protection active</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table desktop / Cards mobile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appareil
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tentatives
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière tentative
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{attempt.ip}</div>
                    <div className="text-sm text-gray-500 font-mono">
                      {attempt.fingerprint.substring(0, 16)}...
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attempt.browser || 'Inconnu'} - {attempt.os || 'Inconnu'}
                    </div>
                    <div className="text-sm text-gray-500">{attempt.device || 'Desktop'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{attempt.attempts}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attempt.isBlocked)}`}>
                      {getStatusLabel(attempt.isBlocked)}
                    </span>
                    {attempt.blockedUntil && (
                      <div className="text-xs text-gray-500 mt-1">
                        Jusqu&apos;au: {formatDate(attempt.blockedUntil)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(attempt.lastAttempt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAttempt(attempt)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Détails
                      </button>
                      {attempt.isBlocked && (
                        <button
                          onClick={() => unblockAttempt(attempt.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Débloquer
                        </button>
                      )}
                      <button
                        onClick={() => deleteAttempt(attempt.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{attempt.ip}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {attempt.fingerprint.substring(0, 16)}...
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attempt.isBlocked)}`}>
                  {getStatusLabel(attempt.isBlocked)}
                </span>
              </div>
              
              <div className="mb-3 space-y-1">
                <p className="text-sm text-gray-900">
                  {attempt.browser || 'Inconnu'} - {attempt.os || 'Inconnu'}
                </p>
                <p className="text-xs text-gray-500">{attempt.device || 'Desktop'}</p>
                <p className="text-xs text-gray-500">
                  {attempt.attempts} tentative{attempt.attempts > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>{formatDate(attempt.lastAttempt)}</span>
              </div>
              
              <div className="flex gap-2">
                {attempt.isBlocked && (
                  <button
                    onClick={() => unblockAttempt(attempt.id)}
                    className="flex-1 text-center py-2 px-3 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100"
                  >
                    Débloquer
                  </button>
                )}
                <button
                  onClick={() => deleteAttempt(attempt.id)}
                  className="flex-1 text-center py-2 px-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails */}
      {selectedAttempt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails de la tentative</h3>
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Informations réseau</h4>
                <p className="text-sm text-gray-600">IP: {selectedAttempt.ip}</p>
                <p className="text-sm text-gray-600">Fingerprint: {selectedAttempt.fingerprint}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Appareil</h4>
                <p className="text-sm text-gray-600">Navigateur: {selectedAttempt.browser || 'Inconnu'}</p>
                <p className="text-sm text-gray-600">Système: {selectedAttempt.os || 'Inconnu'}</p>
                <p className="text-sm text-gray-600">Appareil: {selectedAttempt.device || 'Desktop'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">User-Agent</h4>
                <p className="text-sm text-gray-600 break-all">{selectedAttempt.userAgent}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Informations</h4>
                <p className="text-sm text-gray-600">Tentatives: {selectedAttempt.attempts}</p>
                <p className="text-sm text-gray-600">Statut: {getStatusLabel(selectedAttempt.isBlocked)}</p>
                <p className="text-sm text-gray-600">Dernière tentative: {formatDate(selectedAttempt.lastAttempt)}</p>
                {selectedAttempt.blockedUntil && (
                  <p className="text-sm text-gray-600">Bloqué jusqu&apos;au: {formatDate(selectedAttempt.blockedUntil)}</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                {selectedAttempt.isBlocked && (
                  <button
                    onClick={() => {
                      unblockAttempt(selectedAttempt.id)
                      setSelectedAttempt(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Débloquer
                  </button>
                )}
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 