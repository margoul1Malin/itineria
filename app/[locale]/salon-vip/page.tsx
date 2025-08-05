"use client"
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
}

export default function SalonVIP() {
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const t = useTranslations('vipLounge');

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: t('teamMembers.sophie.name'),
      role: t('teamMembers.sophie.role'),
      description: t('teamMembers.sophie.description'),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      specialties: ["Destinations exotiques", "Voyages de luxe", "Expériences culinaires"]
    },
    {
      id: 2,
      name: t('teamMembers.marc.name'),
      role: t('teamMembers.marc.role'),
      description: t('teamMembers.marc.description'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialties: ["Destinations insolites", "Voyages d'aventure", "Culture locale"]
    },
    {
      id: 3,
      name: t('teamMembers.emma.name'),
      role: t('teamMembers.emma.role'),
      description: t('teamMembers.emma.description'),
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      specialties: ["Expériences uniques", "Voyages romantiques", "Séjours bien-être"]
    },
    {
      id: 4,
      name: t('teamMembers.thomas.name'),
      role: t('teamMembers.thomas.role'),
      description: t('teamMembers.thomas.description'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      specialties: ["Asie du Sud-Est", "Japon", "Australie", "Nouvelle-Zélande"]
    }
  ];

  useEffect(() => {
    // Afficher le popup après 1 seconde
    const timer = setTimeout(() => {
      setShowPremiumPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-green-900 to-stone-800 pt-20">
      {/* Premium Popup */}
      {showPremiumPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-stone-600">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('premiumTitle')}
            </h2>
            <p className="text-stone-300 mb-6">
              {t('premiumDescription')}
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-stone-300">
                <span className="text-green-400 mr-2">✓</span>
                {t('premiumBenefit1')}
              </div>
              <div className="flex items-center text-sm text-stone-300">
                <span className="text-green-400 mr-2">✓</span>
                {t('premiumBenefit2')}
              </div>
              <div className="flex items-center text-sm text-stone-300">
                <span className="text-green-400 mr-2">✓</span>
                {t('premiumBenefit3')}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumPopup(false)}
                className="flex-1 bg-stone-600 text-white py-3 rounded-lg font-semibold hover:bg-stone-500 transition-colors"
              >
                {t('maybeLater')}
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-600 to-stone-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-stone-700 transition-colors">
                {t('upgradeNow')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            👑 {t('title')}
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Services Section */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16 border border-stone-600/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('servicesTitle')}
            </h2>
            <p className="text-lg text-stone-300">
              {t('servicesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-stone-700/80 to-green-800/80 rounded-xl border border-stone-600/50 backdrop-blur-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('service1Title')}</h3>
              <p className="text-stone-300">{t('service1Description')}</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-800/80 to-stone-700/80 rounded-xl border border-stone-600/50 backdrop-blur-sm">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('service2Title')}</h3>
              <p className="text-stone-300">{t('service2Description')}</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-stone-700/80 to-green-800/80 rounded-xl border border-stone-600/50 backdrop-blur-sm">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('service3Title')}</h3>
              <p className="text-stone-300">{t('service3Description')}</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16 border border-stone-600/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('meetOurTeam')}
            </h2>
            <p className="text-lg text-stone-300">
              {t('teamDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-green-500/30 group-hover:ring-green-500/60 transition-all">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-green-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-stone-300 mb-3">
                  {member.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-green-900/50 text-green-300 px-2 py-1 rounded-full text-xs border border-green-700/50"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-stone-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-stone-100 transition-colors">
              {t('contactUs')}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors">
              {t('learnMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 