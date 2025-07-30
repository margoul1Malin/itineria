"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

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
            <button 
              onClick={toggleAccountMenu}
              className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              Compte
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
                  href="/reservations-et-voyages" 
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Réservations et Voyages
                </Link>
                <Link 
                  href="/commentaires-et-notes" 
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Commentaires et Notes
                </Link>
                <Link 
                  href="/favoris" 
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Favoris
                </Link>
              </div>
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
              <div className="pt-4 border-t border-gray-200">
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
