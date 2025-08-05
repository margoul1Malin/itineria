"use client"
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function VoyagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('voyages');
  const locale = useLocale();
  const pathname = usePathname();

  const navigationItems = [
    {
      href: `/${locale}/voyages/vols`,
      label: t('flights'),
      icon: '✈️'
    },
    {
      href: `/${locale}/voyages/hotels`,
      label: t('hotels'),
      icon: '🏨'
    },
    {
      href: `/${locale}/voyages/activites`,
      label: t('activities'),
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      {/* Subheader Navigation */}
      <div className="pt-20 pb-4 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href={`/${locale}/voyages`}
                className="text-gray-500 hover:text-green-600 transition-colors text-sm"
              >
                ← {t('backToVoyages')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="">
        {children}
      </div>
    </div>
  );
} 