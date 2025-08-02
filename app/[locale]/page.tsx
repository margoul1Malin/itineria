"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  
  const heroImages = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop", 
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"
  ];

  const destinations = [
    {
      id: 1,
      nameKey: "bali",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop",
      price: "899€",
      duration: "7"
    },
    {
      id: 2,
      nameKey: "santorini",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop", 
      price: "699€",
      duration: "5"
    },
    {
      id: 3,
      nameKey: "marrakech",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
      price: "449€", 
      duration: "4"
    },
    {
      id: 4,
      nameKey: "tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      price: "1299€",
      duration: "8"
    },
    {
      id: 5,
      nameKey: "newYork",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      price: "999€",
      duration: "6"
    },
    {
      id: 6,
      nameKey: "paris",
      image: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "599€",
      duration: "4"
    },
    {
      id: 7,
      nameKey: "shanghai",
      image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "599€",
      duration: "6"
    },
    {
      id: 8,
      nameKey: "london",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "999€",
      duration: "6"
    },
  ];

  const hotels = [
    {
      id: 1,
      nameKey: "luxeResort",
      locationKey: "maldives",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      rating: 5,
      price: "299€"
    },
    {
      id: 2,
      nameKey: "villaParadis",
      locationKey: "bali",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", 
      rating: 4,
      price: "199€"
    },
    {
      id: 3,
      nameKey: "chateauMedieval",
      locationKey: "loireValley",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      rating: 5,
      price: "399€"
    },
    {
      id: 4,
      nameKey: "riadTraditional",
      locationKey: "marrakech",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
      rating: 4,
      price: "149€"
    },
    {
      id: 5,
      nameKey: "hotelPlageDoree",
      locationKey: "coteDazur",
      image: "https://images.unsplash.com/photo-1624938263838-161ebb0811f7?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
      price: "149€"
    },
    {
      id: 6,
      nameKey: "hotelLuxe",
      locationKey: "paris",
      image: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
      price: "149€"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);





  const weeklyOffers = [
    {
      id: 1,
      nameKey: "hotelPlageDoree",
      locationKey: "coteDazur",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      originalPrice: "299€",
      discountPrice: "199€",
      discount: "-33%"
    },
    {
      id: 2,
      nameKey: "resortTropical",
      locationKey: "thailand",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      originalPrice: "399€",
      discountPrice: "249€",
      discount: "-38%"
    },
    {
      id: 3,
      nameKey: "villaMontagne",
      locationKey: "alps",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      originalPrice: "199€",
      discountPrice: "129€",
      discount: "-35%"
    }
  ];




  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-800/60 to-stone-800/60"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 w-full max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-stone-200">Itineria</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          
          {/* Search Form */}
          <div className="form-container rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('destination')}</label>
                <input 
                  type="text" 
                  placeholder={t('whereToGo')}
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('departure')}</label>
                <input 
                  type="date" 
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('return')}</label>
                <input 
                  type="date" 
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t('search')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

            {/* Destinations Section */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">{t('ourDestinations')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('exploreDestinations')}
            </p>
          </div>
        </div>

        {/* Carousel infini sur toute la largeur */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-infinite">
            {/* Premier set de destinations */}
            {destinations.map((destination) => (
              <div key={`first-${destination.id}`} className="flex-shrink-0 w-80 mx-4 group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={destination.image}
                      alt={t(`destinations.${destination.nameKey}`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{t(`destinations.${destination.nameKey}`)}</h3>
                      <p className="text-stone-200 font-semibold">{t('from')} {destination.price}</p>
                      <p className="text-sm opacity-90">{destination.duration} {t('days')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Deuxième set pour l'effet infini */}
            {destinations.map((destination) => (
              <div key={`second-${destination.id}`} className="flex-shrink-0 w-80 mx-4 group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={destination.image}
                      alt={t(`destinations.${destination.nameKey}`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{t(`destinations.${destination.nameKey}`)}</h3>
                      <p className="text-stone-200 font-semibold">{t('from')} {destination.price}</p>
                      <p className="text-sm opacity-90">{destination.duration} {t('days')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">{t('findIdealTrip')}</h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('searchThousands')}
          </p>
          <div className="form-container rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('destination')}</label>
                <input 
                  type="text" 
                  placeholder={t('whereToGo')}
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('departure')}</label>
                <input 
                  type="date" 
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">{t('return')}</label>
                <input 
                  type="date" 
                  className="input-field w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t('search')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Offers Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">{t('weeklyOffers')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('weeklyOffersDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weeklyOffers.map((offer) => (
              <div key={offer.id} className="group cursor-pointer">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={offer.image}
                        alt={t(`hotels.${offer.nameKey}`)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{t(`hotels.${offer.nameKey}`)}</h3>
                    <p className="text-gray-600 mb-3">{t(`locations.${offer.locationKey}`)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-sm">{offer.originalPrice}</span>
                      <span className="text-green-600 font-bold text-lg">{offer.discountPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">{t('exceptionalHotels')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('exceptionalHotelsDesc')}
            </p>
          </div>
        </div>

        {/* Carousel infini pour les hôtels sur toute la largeur */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-infinite">
            {/* Premier set d'hôtels */}
            {hotels.map((hotel) => (
              <div key={`first-${hotel.id}`} className="flex-shrink-0 w-80 mx-4 group cursor-pointer">
                <div className="bg-brand rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={hotel.image}
                      alt={t(`hotels.${hotel.nameKey}`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{t(`hotels.${hotel.nameKey}`)}</h3>
                    <p className="text-gray-600 mb-3">{t(`locations.${hotel.locationKey}`)}</p>
                    <div className="flex items-center mb-3">
                      {[...Array(hotel.rating)].map((_, i) => (
                        <span key={i} className="text-stone-400">★</span>
                      ))}
                    </div>
                    <p className="text-green-600 font-semibold">{t('from')} {hotel.price}/{t('night')}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Deuxième set pour l'effet infini */}
            {hotels.map((hotel) => (
              <div key={`second-${hotel.id}`} className="flex-shrink-0 w-80 mx-4 group cursor-pointer">
                <div className="bg-brand rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={hotel.image}
                      alt={t(`hotels.${hotel.nameKey}`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{t(`hotels.${hotel.nameKey}`)}</h3>
                    <p className="text-gray-600 mb-3">{t(`locations.${hotel.locationKey}`)}</p>
                    <div className="flex items-center mb-3">
                      {[...Array(hotel.rating)].map((_, i) => (
                        <span key={i} className="text-stone-400">★</span>
                      ))}
                    </div>
                    <p className="text-green-600 font-semibold">{t('from')} {hotel.price}/{t('night')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">{t('readyForAdventure')}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('travelExperts')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {t('planMyTrip')}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors">
              {t('requestQuote')}
            </button>
          </div>
        </div>
      </section>

      {/* Login/Register CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">{t('joinItineria')}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('joinDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              {t('login')}
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors">
              {t('register')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
