"use client"

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/ItineriaLogo.png"
                alt="Itineria"
                width={40}
                height={40}
                className="mr-2"
              />
              <h3 className="text-2xl font-bold text-stone-200">Itineria</h3>
            </div>
            <p className="text-gray-300">
              Votre partenaire de confiance pour des voyages d&apos;exception
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-stone-200">Europe</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Asie</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Amériques</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Afrique</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/vols" className="hover:text-stone-200 text-white font-bold">Vols</Link></li>
              <li><Link href="/hotels" className="hover:text-stone-200 text-white font-bold">Hôtels</Link></li>
              <li><Link href="/activites" className="hover:text-stone-200 text-white font-bold">Activités</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Assurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/contact" className="hover:text-stone-200">+33 1 23 45 67 89</Link></li>
              <li><Link href="/contact" className="hover:text-stone-200">contact@itineria.fr</Link></li>
              <li><Link href="/contact" className="hover:text-stone-200">123 Rue du Voyage, Paris</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Legal Links - Responsive */}
        <div className="mt-8 pt-8 border-t border-green-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ul className="flex flex-wrap justify-center gap-4 text-gray-300 text-sm">
              <li><Link href="/" className="hover:text-stone-200">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Politique de confidentialité</Link></li>
              <li><Link href="/" className="hover:text-stone-200">Cookies</Link></li>
              <li><Link href="/" className="hover:text-stone-200">CGV</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Itineria. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
