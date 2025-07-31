"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser(null);
        setIsAccountMenuOpen(false);
        // Rediriger vers la page d'accueil
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    // Vérifier l'état de connexion
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Écouter les événements de changement d'authentification
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Écouter les événements de navigation (pour détecter les changements de page)
    window.addEventListener('focus', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    // Écouter les événements personnalisés d'authentification
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('focus', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/ItineriaLogo.png"
              alt="Itineria"
              width={1000}
              height={1000}
              className="mr-2 w-12 h-12 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-green-800">Itineria</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-bold">
            <Link href="/vols" className="text-gray-700 hover:text-green-600 transition-colors">
              Vols
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-green-600 transition-colors">
              Hôtels
            </Link>
            <Link href="/activites" className="text-gray-700 hover:text-green-600 transition-colors">
              Activités
            </Link>
            <Link href="/vols-et-hotels" className="text-gray-700 hover:text-green-600 transition-colors">
              Vols & Hôtels
            </Link>
            <Link href="/contact" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Ajouter votre établissement
            </Link>
          </nav>

          {/* Desktop Account Menu */}
          <div className="hidden md:block relative">
            {!isLoading && (
              <>
                {user ? (
                  // Utilisateur connecté
                  <>
                    <button 
                      onClick={toggleAccountMenu}
                      className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                      <svg className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isAccountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link 
                          href="/profil" 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          Profil
                        </Link>
                        <Link 
                          href="/vols" 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          Vols
                        </Link>
                        <Link 
                          href="/hotels" 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          Hôtels
                        </Link>
                        <Link 
                          href="/activites" 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          Activités
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'super_admin') && (
                          <>
                            <div className="border-t border-gray-200 my-1"></div>
                            <Link 
                              href="/admin" 
                              className="block px-4 py-2 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium"
                            >
                              🛠️ Administration
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Utilisateur non connecté
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/login" 
                      className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                    >
                      Connexion
                    </Link>
                    <Link 
                      href="/register" 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link href="/vols" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Vols
              </Link>
              <Link href="/hotels" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Hôtels
              </Link>
              <Link href="/activites" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Activités
              </Link>
              <Link href="/vols-et-hotels" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Vols & Hôtels
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Contact
              </Link>
              {!isLoading && (
                <>
                  {user ? (
                    // Utilisateur connecté
                    <div className="pt-4 border-t border-gray-200">
                      <div className="px-3 py-2 text-gray-700 font-bold">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                      </div>
                      <div className="px-3 py-2 text-gray-700 font-bold cursor-pointer" onClick={toggleAccountMenu}>Compte</div>
                      {isAccountMenuOpen && (
                        <>
                          <Link href="/profil" className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Profil
                          </Link>
                          <Link href="/reservations-et-voyages" className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Réservations et Voyages
                          </Link>
                          <Link href="/commentaires-et-notes" className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Commentaires et Notes
                          </Link>
                          <Link href="/favoris" className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Favoris
                          </Link>
                          {(user?.role === 'admin' || user?.role === 'super_admin') && (
                            <>
                              <div className="border-t border-gray-200 my-1 mx-3"></div>
                              <Link href="/admin" className="block px-6 py-2 text-orange-600 hover:text-orange-700 transition-colors font-medium">
                                🛠️ Administration
                              </Link>
                            </>
                          )}
                          <div className="border-t border-gray-200 my-1 mx-3"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-6 py-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            Déconnexion
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    // Utilisateur non connecté
                    <div className="pt-4 border-t border-gray-200">
                      <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                        Connexion
                      </Link>
                      <Link href="/register" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                        Inscription
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
