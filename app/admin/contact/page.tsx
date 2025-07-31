"use client"
import { useState, useEffect } from 'react'

interface ContactQuery {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminContact() {
  const [contacts, setContacts] = useState<ContactQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedContact, setSelectedContact] = useState<ContactQuery | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyData, setReplyData] = useState({
    subject: '',
    message: ''
  })
  const [isSendingReply, setIsSendingReply] = useState(false)

  useEffect(() => {
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, currentPage])

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        status: selectedStatus,
        page: currentPage.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/contact?${params}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contactQueries)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        // Mettre à jour la liste
        setContacts(prev => prev.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ))
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const sendReply = async () => {
    if (!selectedContact) return

    setIsSendingReply(true)
    try {
      const response = await fetch(`/api/admin/contact/${selectedContact.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(replyData)
      })

      if (response.ok) {
        // Mettre à jour le statut dans la liste
        setContacts(prev => prev.map(contact => 
          contact.id === selectedContact.id ? { ...contact, status: 'processed' } : contact
        ))
        setShowReplyModal(false)
        setReplyData({ subject: '', message: '' })
        setSelectedContact(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de l\'envoi de la réponse')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error)
      alert('Erreur lors de l\'envoi de la réponse')
    } finally {
      setIsSendingReply(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processed':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'processed':
        return 'Traité'
      case 'resolved':
        return 'Résolu'
      case 'archived':
        return 'Archivé'
      default:
        return status
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de contact</h1>
          <p className="text-gray-600 mt-2">Gérer les demandes de contact des utilisateurs</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processed">Traité</option>
            <option value="resolved">Résolu</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sujet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {contact.message.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full  ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContact(contact)
                          setShowReplyModal(true)
                          setReplyData({ subject: '', message: '' })
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Répondre
                      </button>
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 text-black"
                      >
                        <option value="pending">En attente</option>
                        <option value="processed">Traité</option>
                        <option value="resolved">Résolu</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails de la demande</h3>
                <button
                  onClick={() => setSelectedContact(null)}
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
                <h4 className="font-medium text-gray-900">Informations utilisateur</h4>
                <p className="text-sm text-gray-600">Nom: {selectedContact.name}</p>
                <p className="text-sm text-gray-600">Email: {selectedContact.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sujet</h4>
                <p className="text-sm text-gray-600">{selectedContact.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Message</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Informations</h4>
                <p className="text-sm text-gray-600">Créé le: {new Date(selectedContact.createdAt).toLocaleString('fr-FR')}</p>
                <p className="text-sm text-gray-600">Modifié le: {new Date(selectedContact.updatedAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réponse */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Répondre à {selectedContact.name}</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setSelectedContact(null)
                    setReplyData({ subject: '', message: '' })
                  }}
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
                <h4 className="font-medium text-gray-900 mb-2">Demande originale</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600"><strong>Sujet :</strong> {selectedContact.subject}</p>
                  <p className="text-sm text-gray-600 mt-2"><strong>Message :</strong></p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet de la réponse *
                </label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="Sujet de votre réponse"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message de réponse *
                </label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="Votre message de réponse..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setSelectedContact(null)
                    setReplyData({ subject: '', message: '' })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={sendReply}
                  disabled={isSendingReply || !replyData.subject || !replyData.message}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isSendingReply || !replyData.subject || !replyData.message
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSendingReply ? 'Envoi...' : 'Envoyer la réponse'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 