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
    try {
      const response = await fetch(`/api/user/payment-methods/${methodId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
        setMessage({ type: 'success', text: 'Moyen de paiement supprimé avec succès' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Moyens de paiement</h2>
      <div className="space-y-6">
        {/* Cartes enregistrées */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cartes enregistrées</h3>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun moyen de paiement enregistré</p>
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
                      <div className="font-semibold text-gray-700">{method.maskedNumber}</div>
                      <div className="text-sm text-gray-500">Expire {method.expiryDate}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ajouter une nouvelle carte */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ajouter une nouvelle carte</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de carte</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date d&apos;expiration</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Code de sécurité</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du titulaire</label>
              <input
                type="text"
                placeholder="Nom et prénom"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
              Ajouter la carte
            </button>
          </div>
        </div>

        {/* Autres moyens de paiement */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Autres moyens de paiement</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <span className="font-medium text-gray-700">PayPal</span>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Configurer
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AP</span>
                </div>
                <span className="font-medium text-gray-700">Apple Pay</span>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Configurer
              </button>
            </div>
          </div>
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
    </>
  );
} 