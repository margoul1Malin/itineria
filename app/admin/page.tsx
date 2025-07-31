"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
interface DashboardStats {
  totalContacts: number
  pendingContacts: number
  processedContacts: number
  totalBruteforceAttempts: number
  blockedAttempts: number
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>
  recentAttempts: Array<{
    id: string;
    ip: string;
    attempts: number;
    isBlocked: boolean;
    browser: string | null;
    os: string | null;
    device: string | null;
    lastAttempt: string;
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Vue d&apos;ensemble de l&apos;activité du site</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Total contacts</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{stats.totalContacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">En attente</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{stats.pendingContacts}</p>
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
                <p className="text-xs md:text-sm font-medium text-gray-600">Traitées</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{stats.processedContacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Tentatives bloquées</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{stats.blockedAttempts}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu récent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Demandes de contact récentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Demandes de contact récentes</h3>
          </div>
          <div className="p-4 md:p-6">
            {stats?.recentContacts && stats.recentContacts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentContacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2 md:gap-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">{contact.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{contact.email}</p>
                      <p className="text-xs md:text-sm text-gray-500">{contact.subject}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {contact.status === 'pending' ? 'En attente' :
                         contact.status === 'processed' ? 'Traité' : 'Résolu'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune demande récente</p>
            )}
          </div>
        </div>

        {/* Tentatives de connexion récentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tentatives de connexion récentes</h3>
          </div>
          <div className="p-6">
            {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{attempt.ip}</p>
                      <p className="text-sm text-gray-600">{attempt.browser || 'Inconnu'} - {attempt.os || 'Inconnu'}</p>
                      <p className="text-sm text-gray-500">{attempt.device || 'Desktop'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        attempt.isBlocked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {attempt.isBlocked ? 'Bloqué' : 'Autorisé'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {attempt.attempts} tentatives
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(attempt.lastAttempt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune tentative récente</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/contact"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium text-blue-900">Gérer les contacts</p>
              <p className="text-sm text-blue-600">Voir et traiter les demandes</p>
            </div>
          </Link>

          <Link
            href="/admin/bruteforce"
            className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="font-medium text-red-900">Sécurité</p>
              <p className="text-sm text-red-600">Surveiller les tentatives</p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <div>
              <p className="font-medium text-green-900">Voir le site</p>
              <p className="text-sm text-green-600">Retour au site public</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 