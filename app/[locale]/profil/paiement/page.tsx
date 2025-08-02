"use client"
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl';

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

interface PaymentMethod {
  id: string;
  type: string;
  maskedNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: string;
}

export default function PaiementPage() {
  const t = useTranslations('profile.payment');
  const tProfile = useTranslations('profile');
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        } else {
          console.error('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/user/payment-methods', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data.paymentMethods || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des moyens de paiement:', error);
      }
    };

    fetchUserData();
    fetchPaymentMethods();
  }, []);

  const handleDeletePaymentMethod = async (methodId: string) => {
    if (!confirm(t('deleteConfirm'))) return

    try {
      const response = await fetch(`/api/user/payment-methods?id=${methodId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
        setMessage({ type: 'success', text: t('deleteSuccess') });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || t('deleteError') });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: t('deleteError') });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch('/api/user/payment-methods/set-default', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentMethodId: methodId })
      })

      if (response.ok) {
        // Mettre à jour l'état local
        setPaymentMethods(prev => prev.map(method => ({
          ...method,
          isDefault: method.id === methodId
        })))
        setMessage({ type: 'success', text: t('defaultUpdateSuccess') })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || t('defaultUpdateError') })
      }
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: t('defaultUpdateError') })
      setTimeout(() => setMessage(null), 3000)
    }
  };

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const cardData = {
      type: 'VISA', // Détecter automatiquement le type de carte
      cardNumber: formData.get('cardNumber') as string,
      expiryDate: formData.get('expiryDate') as string,
      cardholderName: formData.get('cardholderName') as string
    }

    try {
      const response = await fetch('/api/user/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cardData)
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(prev => [...prev, data.paymentMethod])
        setMessage({ type: 'success', text: t('addCardSuccess') })
        // Réinitialiser le formulaire de manière sûre
        if (form) {
          form.reset()
        }
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || t('addCardError') })
      }
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      setMessage({ type: 'error', text: t('addCardError') })
      setTimeout(() => setMessage(null), 3000)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProfile('loadingError')}</h2>
          <p className="text-gray-600">{tProfile('cannotLoadProfile')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('title')}</h2>
      <div className="space-y-6">
        {/* Cartes enregistrées */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('savedCards')}</h3>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t('noPaymentMethods')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-8 rounded flex items-center justify-center ${
                      method.type === 'VISA' ? 'bg-blue-600' : 
                      method.type === 'MASTERCARD' ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      <span className="text-white text-xs font-bold">
                        {method.type === 'VISA' ? 'VISA' : 
                         method.type === 'MASTERCARD' ? 'MC' : method.type}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 flex items-center gap-2">
                        {method.maskedNumber}
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('default')}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{t('expires')} {method.expiryDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {t('setAsDefault')}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ajouter une nouvelle carte */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('addNewCard')}</h3>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">{t('paymentSecurity')}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {t('securityNotice')}
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cardNumber')} *</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                pattern="[0-9\s]{19}"
                maxLength={19}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                onChange={(e) => {
                  // Formater automatiquement le numéro de carte
                  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                  value = value.replace(/(\d{4})/g, '$1 ').trim();
                  e.target.value = value;
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('expiryDate')} *</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/AA"
                  pattern="[0-9]{2}/[0-9]{2}"
                  maxLength={5}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  onChange={(e) => {
                    // Formater automatiquement la date
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    e.target.value = value;
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('securityCode')} *</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="XXX"
                  pattern="[0-9]{3,4}"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  onChange={(e) => {
                    // Limiter aux chiffres
                    e.target.value = e.target.value.replace(/\D/g, '');
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cardholderName')} *</label>
              <input
                type="text"
                name="cardholderName"
                placeholder={t('cardholderPlaceholder')}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
              {t('addCardButton')}
            </button>
          </form>
        </div>

        {/* Message de succès/erreur */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </>
  )
} 