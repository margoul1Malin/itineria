'use client'
import { useTranslations, useLocale } from 'next-intl';

export default function TestTranslation() {
  const locale = useLocale();
  const t = useTranslations('flights');
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Test des traductions
      </h1>
      
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <strong>DEBUG - Locale détectée:</strong> {locale || 'undefined'}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation translations */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3 text-gray-800">Navigation</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>Home:</strong> {tNav('home')}</li>
            <li><strong>Flights:</strong> {tNav('flights')}</li>
            <li><strong>Hotels:</strong> {tNav('hotels')}</li>
            <li><strong>Activities:</strong> {tNav('activities')}</li>
          </ul>
        </div>

        {/* Flights translations */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3 text-blue-800">Vols/Flights</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>Title:</strong> {t('title')}</li>
            <li><strong>From:</strong> {t('from')}</li>
            <li><strong>To:</strong> {t('to')}</li>
            <li><strong>Search:</strong> {t('search')}</li>
            <li><strong>One Way:</strong> {t('oneWay')}</li>
            <li><strong>Round Trip:</strong> {t('roundTrip')}</li>
          </ul>
        </div>

        {/* Common translations */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3 text-green-800">Common</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>Search:</strong> {tCommon('search')}</li>
            <li><strong>Save:</strong> {tCommon('save')}</li>
            <li><strong>Cancel:</strong> {tCommon('cancel')}</li>
            <li><strong>Language:</strong> {tCommon('language')}</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ✅ Si vous voyez du contenu différent en changeant de langue (/fr, /en, /de, /es), les traductions fonctionnent !
        </p>
      </div>
    </div>
  );
} 