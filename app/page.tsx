"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop", 
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const destinations = [
    {
      id: 1,
      name: "Bali, Indonésie",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop",
      price: "À partir de 899€",
      duration: "7 jours"
    },
    {
      id: 2,
      name: "Santorini, Grèce",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop", 
      price: "À partir de 699€",
      duration: "5 jours"
    },
    {
      id: 3,
      name: "Marrakech, Maroc",
      image: "https://images.unsplash.com/photo-1553603228-0f4033c36a8d?w=600&h=400&fit=crop",
      price: "À partir de 449€", 
      duration: "4 jours"
    },
    {
      id: 4,
      name: "Tokyo, Japon",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      price: "À partir de 1299€",
      duration: "8 jours"
    },
    {
      id: 5,
      name: "New York, USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      price: "À partir de 999€",
      duration: "6 jours"
    },
    {
      id: 6,
      name: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop",
      price: "À partir de 599€",
      duration: "4 jours"
    }
  ];

  const hotels = [
    {
      id: 1,
      name: "Hôtel Luxe Resort",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      rating: 5,
      price: "À partir de 299€/nuit"
    },
    {
      id: 2,
      name: "Villa Paradis",
      location: "Bali",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", 
      rating: 4,
      price: "À partir de 199€/nuit"
    },
    {
      id: 3,
      name: "Château Médiéval",
      location: "Loire Valley",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      rating: 5,
      price: "À partir de 399€/nuit"
    },
    {
      id: 4,
      name: "Riad Traditionnel",
      location: "Marrakech",
      image: "https://images.unsplash.com/photo-1553603228-0f4033c36a8d?w=600&h=400&fit=crop",
      rating: 4,
      price: "À partir de 149€/nuit"
    }
  ];

  const weeklyOffers = [
    {
      id: 1,
      name: "Hôtel Plage Dorée",
      location: "Côte d'Azur",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      originalPrice: "299€",
      discountPrice: "199€",
      discount: "-33%"
    },
    {
      id: 2,
      name: "Resort Tropical",
      location: "Thaïlande",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      originalPrice: "399€",
      discountPrice: "249€",
      discount: "-38%"
    },
    {
      id: 3,
      name: "Villa Montagne",
      location: "Alpes",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      originalPrice: "199€",
      discountPrice: "129€",
      discount: "-35%"
    }
  ];

  const nextDestination = () => {
    setCurrentDestinationIndex((prev) => (prev + 1) % Math.ceil(destinations.length / 4));
  };

  const prevDestination = () => {
    setCurrentDestinationIndex((prev) => 
      prev === 0 ? Math.ceil(destinations.length / 4) - 1 : prev - 1
    );
  };

  const nextHotel = () => {
    setCurrentHotelIndex((prev) => (prev + 1) % Math.ceil(hotels.length / 3));
  };

  const prevHotel = () => {
    setCurrentHotelIndex((prev) => 
      prev === 0 ? Math.ceil(hotels.length / 3) - 1 : prev - 1
    );
  };

  const visibleDestinations = destinations.slice(currentDestinationIndex * 4, (currentDestinationIndex * 4) + 4);
  const visibleHotels = hotels.slice(currentHotelIndex * 3, (currentHotelIndex * 3) + 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-stone-200">Itineria</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Découvrez le monde avec nos voyages d'exception
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Découvrir nos voyages
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors">
              Nous contacter
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Trouvez votre voyage idéal</h2>
          <p className="text-lg text-gray-600 mb-8">
            Recherchez parmi des milliers de destinations et trouvez l'offre parfaite
          </p>
          <div className="bg-gradient-to-r from-green-50 to-stone-50 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Où voulez-vous aller ?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Départ</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Retour</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Nos Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez nos destinations les plus populaires et laissez-vous porter par l'aventure
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleDestinations.map((destination) => (
                <div key={destination.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                        <p className="text-stone-200 font-semibold">{destination.price}</p>
                        <p className="text-sm opacity-90">{destination.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevDestination}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextDestination}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Weekly Offers Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Offres de la Semaine</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profitez de nos réductions exceptionnelles sur une sélection d'hôtels
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
                        alt={offer.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{offer.name}</h3>
                    <p className="text-gray-600 mb-3">{offer.location}</p>
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
      <section className="py-20 px-4 bg-gradient-to-br from-stone-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Hôtels d'Exception</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Séjournez dans des établissements uniques et luxueux
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleHotels.map((hotel) => (
                <div key={hotel.id} className="group cursor-pointer">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-green-800 mb-2">{hotel.name}</h3>
                      <p className="text-gray-600 mb-3">{hotel.location}</p>
                      <div className="flex items-center mb-3">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <span key={i} className="text-stone-400">★</span>
                        ))}
                      </div>
                      <p className="text-green-600 font-semibold">{hotel.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevHotel}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextHotel}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Prêt à partir à l'aventure ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Nos experts en voyage sont là pour créer votre séjour parfait
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Planifier mon voyage
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors">
              Demander un devis
            </button>
          </div>
        </div>
      </section>

      {/* Login/Register CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Rejoignez Itineria</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Créez votre compte pour accéder à des offres exclusives, sauvegarder vos voyages préférés et recevoir nos meilleures promotions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Se connecter
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-stone-200 mb-4">Itineria</h3>
              <p className="text-gray-300">
                Votre partenaire de confiance pour des voyages d'exception
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Europe</li>
                <li>Asie</li>
                <li>Amériques</li>
                <li>Afrique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Vols</li>
                <li>Hôtels</li>
                <li>Activités</li>
                <li>Assurance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>+33 1 23 45 67 89</li>
                <li>contact@itineria.fr</li>
                <li>123 Rue du Voyage, Paris</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Itineria. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
