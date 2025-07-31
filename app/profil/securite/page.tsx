"use client"
import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  currency: string;
  language: string;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  emailVerified: boolean;
  paymentMethods?: Array<{
    id: string;
    type: string;
    maskedNumber: string;
    expiryDate: string;
    cardholderName: string;
    isDefault: boolean;
    createdAt: string;
  }>;
  createdAt: string;
  lastLogin?: string;
}

export default function SecuritePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorData, setTwoFactorData] = useState({
    enabled: false,
    secret: '',
    code: ''
  });
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setTwoFactorData({
            enabled: data.user.twoFactorEnabled,
            secret: '',
            code: ''
          });
        } else {
          console.error('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const response = await fetch('/api/user/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors du changement de mot de passe' });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les données du profil</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sécurité</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ancien mot de passe</label>
          <input
            type="password"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
          <input
            type="password"
            value={securityData.newPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
          />
        </div>
        <button 
          onClick={handleChangePassword}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Changer le mot de passe
        </button>

        {/* Authentification à 2 facteurs */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Authentification à 2 facteurs</h3>
              <p className="text-sm text-gray-500">
                {user.twoFactorEnabled 
                  ? 'Votre compte est protégé par l\'authentification à 2 facteurs'
                  : 'Sécurisez votre compte avec un code supplémentaire'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user.twoFactorEnabled && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activée
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={user.twoFactorEnabled}
                  disabled={true}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  user.twoFactorEnabled 
                    ? 'bg-green-600 after:translate-x-full' 
                    : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
          </div>
          
          {user.twoFactorEnabled ? (
            // Interface quand la 2FA est activée
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-800">2FA Activée</p>
                    <p className="text-sm text-green-700 mt-1">
                      Votre compte est protégé. Vous recevrez un code par email à chaque connexion.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/user/security', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          action: 'enable'
                        })
                      });

                      if (response.ok) {
                        setMessage({ type: 'success', text: 'Code de vérification envoyé par email' });
                        setShowTwoFactorModal(true);
                        setTimeout(() => setMessage(null), 3000);
                      } else {
                        const data = await response.json();
                        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi du code' });
                        setTimeout(() => setMessage(null), 3000);
                      }
                    } catch (error) {
                      console.error('Erreur lors de l\'envoi du code:', error);
                      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du code' });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Renvoyer le code
                </button>
                
                <button 
                  onClick={async () => {
                    if (!confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à 2 facteurs ? Votre compte sera moins sécurisé.')) {
                      return;
                    }
                    
                    try {
                      const response = await fetch('/api/user/security', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          action: 'disable'
                        })
                      });

                      if (response.ok) {
                        setMessage({ type: 'success', text: '2FA désactivée avec succès' });
                        // Mettre à jour l'état local
                        setUser(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
                        setTimeout(() => setMessage(null), 3000);
                      } else {
                        const data = await response.json();
                        setMessage({ type: 'error', text: data.error || 'Erreur lors de la désactivation' });
                        setTimeout(() => setMessage(null), 3000);
                      }
                    } catch (error) {
                      console.error('Erreur lors de la désactivation:', error);
                      setMessage({ type: 'error', text: 'Erreur lors de la désactivation' });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Désactiver la 2FA
                </button>
              </div>
            </div>
          ) : (
            // Interface quand la 2FA est désactivée
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/user/security', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      action: 'enable'
                    })
                  });

                  if (response.ok) {
                    setMessage({ type: 'success', text: 'Code de vérification envoyé par email' });
                    setShowTwoFactorModal(true);
                    setTimeout(() => setMessage(null), 3000);
                  } else {
                    const data = await response.json();
                    setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi du code' });
                    setTimeout(() => setMessage(null), 3000);
                  }
                } catch (error) {
                  console.error('Erreur lors de l\'envoi du code:', error);
                  setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du code' });
                  setTimeout(() => setMessage(null), 3000);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Configurer la 2FA
            </button>
          )}
        </div>
      </div>

      {/* Messages de notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Modal 2FA */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.twoFactorEnabled ? 'Vérification 2FA' : 'Configuration 2FA'}
              </h3>
              <button
                onClick={() => setShowTwoFactorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {user?.twoFactorEnabled 
                  ? 'Entrez le code de vérification envoyé par email pour confirmer votre identité.'
                  : 'Entrez le code de vérification envoyé par email pour activer l\'authentification à 2 facteurs.'
                }
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={twoFactorData.code}
                  onChange={(e) => setTwoFactorData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="123456"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTwoFactorModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/user/security', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          action: 'verify',
                          code: twoFactorData.code
                        })
                      });

                      if (response.ok) {
                        setMessage({ type: 'success', text: user?.twoFactorEnabled ? 'Code vérifié avec succès' : '2FA activé avec succès' });
                        setShowTwoFactorModal(false);
                        setTwoFactorData(prev => ({ ...prev, code: '' }));
                        // Mettre à jour l'état local si c'est une activation
                        if (!user?.twoFactorEnabled) {
                          setUser(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
                        }
                        setTimeout(() => setMessage(null), 3000);
                      } else {
                        const data = await response.json();
                        setMessage({ type: 'error', text: data.error || 'Erreur lors de la vérification' });
                        setTimeout(() => setMessage(null), 3000);
                      }
                    } catch (error) {
                      console.error('Erreur lors de l\'activation:', error)
                      setMessage({ type: 'error', text: 'Erreur lors de l\'activation' });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  {user?.twoFactorEnabled ? 'Vérifier' : 'Activer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 