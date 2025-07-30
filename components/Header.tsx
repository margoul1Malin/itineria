"use client"
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-800">Itineria</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Destinations
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Hôtels
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Activités
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              À propos
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Se connecter
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-colors">
              S'inscrire
            </button>
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
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Destinations
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Hôtels
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Activités
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                À propos
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                Contact
              </a>
              <div className="pt-4 space-y-2">
                <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Se connecter
                </button>
                <button className="block w-full text-left px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
