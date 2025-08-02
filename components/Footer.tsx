"use client"

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tLegal = useTranslations('legal');
  const locale = useLocale();

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
              {t('tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('destinations')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={`/${locale}/`} className="hover:text-stone-200">{t('europe')}</Link></li>
              <li><Link href={`/${locale}/`} className="hover:text-stone-200">{t('asia')}</Link></li>
              <li><Link href={`/${locale}/`} className="hover:text-stone-200">{t('americas')}</Link></li>
              <li><Link href={`/${locale}/`} className="hover:text-stone-200">{t('africa')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={`/${locale}/vols`} className="hover:text-stone-200 text-white font-bold">{tNav('flights')}</Link></li>
              <li><Link href={`/${locale}/hotels`} className="hover:text-stone-200 text-white font-bold">{tNav('hotels')}</Link></li>
              <li><Link href={`/${locale}/activites`} className="hover:text-stone-200 text-white font-bold">{tNav('activities')}</Link></li>
              <li><Link href={`/${locale}/`} className="hover:text-stone-200">{t('insurance')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{tNav('contact')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={`/${locale}/contact`} className="hover:text-stone-200">+33 1 23 45 67 89</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-stone-200">contact@itineria.fr</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-stone-200">123 Rue du Voyage, Paris</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Legal Links - Responsive */}
        <div className="mt-8 pt-8 border-t border-green-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ul className="flex flex-wrap justify-center gap-4 text-gray-300 text-sm">
              <li><Link href={`/${locale}/legal/terms`} className="hover:text-stone-200">{tLegal('terms')}</Link></li>
              <li><Link href={`/${locale}/legal/privacy`} className="hover:text-stone-200">{tLegal('privacy')}</Link></li>
              <li><Link href={`/${locale}/legal/cookies`} className="hover:text-stone-200">{tLegal('cookies')}</Link></li>
              <li><Link href={`/${locale}/legal/cgv`} className="hover:text-stone-200">{tLegal('cgv')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Itineria. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
