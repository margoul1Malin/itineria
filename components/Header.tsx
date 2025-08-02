"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSelector from './LanguageSelector';

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
  
  const t = useTranslations('navigation');
  const locale = useLocale();

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
        // Rediriger vers la page d'accueil avec la locale
        window.location.href = `/${locale}`;
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
            <Link href={`/${locale}`}>
              <Image
                src="/ItineriaLogo.png"
                alt="Itineria"
                width={1000}
                height={1000}
                className="mr-2 w-12 h-12 rounded-lg cursor-pointer"
              />
            </Link>
            <Link href={`/${locale}`}>
              <h1 className="text-2xl font-bold text-green-800 cursor-pointer">Itineria</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-bold">
            <Link href={`/${locale}/vols`} className="text-gray-700 hover:text-green-600 transition-colors">
              {t('flights')}
            </Link>
            <Link href={`/${locale}/hotels`} className="text-gray-700 hover:text-green-600 transition-colors">
              {t('hotels')}
            </Link>
            <Link href={`/${locale}/activites`} className="text-gray-700 hover:text-green-600 transition-colors">
              {t('activities')}
            </Link>
            <Link href={`/${locale}/vols-et-hotels`} className="text-gray-700 hover:text-green-600 transition-colors">
              {t('flightsAndHotels')}
            </Link>
            <Link href={`/${locale}/contact`} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              {t('contact')}
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Account Menu */}
            {!isLoading && (
              <>
                {user ? (
                  // Utilisateur connecté
                  <div className="relative">
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
                          href={`/${locale}/profil`} 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          {t('profile')}
                        </Link>
                        <Link 
                          href={`/${locale}/vols`} 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          {t('flights')}
                        </Link>
                        <Link 
                          href={`/${locale}/hotels`} 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          {t('hotels')}
                        </Link>
                        <Link 
                          href={`/${locale}/activites`} 
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          {t('activities')}
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'super_admin') && (
                          <>
                            <div className="border-t border-gray-200 my-1"></div>
                            <Link 
                              href={`/${locale}/admin`} 
                              className="block px-4 py-2 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium"
                            >
                              🛠️ {t('admin')}
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Utilisateur non connecté
                  <div className="flex items-center space-x-4">
                    <Link 
                      href={`/${locale}/login`} 
                      className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                    >
                      {t('login')}
                    </Link>
                    <Link 
                      href={`/${locale}/register`} 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {t('register')}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selector Mobile */}
            <LanguageSelector />
            
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
              <Link href={`/${locale}/vols`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('flights')}
              </Link>
              <Link href={`/${locale}/hotels`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('hotels')}
              </Link>
              <Link href={`/${locale}/activites`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('activities')}
              </Link>
              <Link href={`/${locale}/vols-et-hotels`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('flightsAndHotels')}
              </Link>
              <Link href={`/${locale}/contact`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('contact')}
              </Link>
              
              {/* Lien admin direct dans le menu mobile */}
              {!isLoading && user && (user?.role === 'admin' || user?.role === 'super_admin') && (
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <Link href={`/${locale}/admin`} className="block px-3 py-2 text-orange-600 hover:text-orange-700 transition-colors font-medium">
                    🛠️ {t('admin')}
                  </Link>
                </div>
              )}
              
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
                          <Link href={`/${locale}/profil`} className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            {t('profile')}
                          </Link>
                          <Link href={`/${locale}/reservations-et-voyages`} className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Réservations et Voyages
                          </Link>
                          <Link href={`/${locale}/commentaires-et-notes`} className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Commentaires et Notes
                          </Link>
                          <Link href={`/${locale}/favoris`} className="block px-6 py-2 text-gray-600 hover:text-green-600 transition-colors">
                            Favoris
                          </Link>
                          {(user?.role === 'admin' || user?.role === 'super_admin') && (
                            <>
                              <div className="border-t border-gray-200 my-1 mx-3"></div>
                              <Link href={`/${locale}/admin`} className="block px-6 py-2 text-orange-600 hover:text-orange-700 transition-colors font-medium">
                                🛠️ {t('admin')}
                              </Link>
                            </>
                          )}
                          <div className="border-t border-gray-200 my-1 mx-3"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-6 py-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            {t('logout')}
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    // Utilisateur non connecté
                    <div className="pt-4 border-t border-gray-200">
                      <Link href={`/${locale}/login`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                        {t('login')}
                      </Link>
                      <Link href={`/${locale}/register`} className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                        {t('register')}
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
