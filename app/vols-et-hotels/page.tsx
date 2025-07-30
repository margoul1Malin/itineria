"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

export default function VolsEtHotels() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setCurrentDestinationIndex] = useState(0);
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  
  const heroImages = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop", 
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
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
      image: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "À partir de 599€",
      duration: "4 jours"
    },
    {
      id: 7,
      name: "Shangai, Chine",
      image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "À partir de 599€",
      duration: "6 jours"
    },
    {
      id: 8,
      name: "Londres, Royaume-Uni",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "À partir de 999€",
      duration: "6 jours"
    },
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
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
      rating: 4,
      price: "À partir de 149€/nuit"
    },
    {
      id: 5,
      name: "Hôtel Plage Dorée",
      location: "Côte d'Azur",
      image: "https://images.unsplash.com/photo-1624938263838-161ebb0811f7?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
      price: "À partir de 149€/nuit"
    },
    {
      id: 6,
      name: "Hôtel de Luxe",
      location: "Paris",
      image: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
      price: "À partir de 149€/nuit"
    }
  ];
  // Auto-scroll for destinations carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentDestinationIndex((prev) => (prev + 1) % Math.ceil(destinations.length / 4));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isTransitioning, destinations.length]);

  // Auto-scroll for hotels carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentHotelIndex((prev) => (prev + 1) % Math.ceil(hotels.length / 3));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning, hotels.length]);


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
  ]

  const nextHotel = () => {
    setIsTransitioning(true);
    setCurrentHotelIndex((prev) => (prev + 1) % Math.ceil(hotels.length / 3));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevHotel = () => {
    setIsTransitioning(true);
    setCurrentHotelIndex((prev) => 
      prev === 0 ? Math.ceil(hotels.length / 3) - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const visibleHotels = hotels.slice(currentHotelIndex * 3, (currentHotelIndex * 3) + 3);

  const handleDateSelect = (date: string) => {
    if (!selectedDates.start) {
      setSelectedDates({ start: date, end: '' });
    } else if (!selectedDates.end) {
      if (date >= selectedDates.start) {
        setSelectedDates({ start: selectedDates.start, end: date });
        setIsCalendarOpen(false);
      } else {
        setSelectedDates({ start: date, end: selectedDates.start });
        setIsCalendarOpen(false);
      }
    } else {
      setSelectedDates({ start: date, end: '' });
    }
  };

  const getDateDisplay = () => {
    if (selectedDates.start && selectedDates.end) {
      return `${selectedDates.start} - ${selectedDates.end}`;
    } else if (selectedDates.start) {
      return `${selectedDates.start} - Sélectionner fin`;
    }
    return "Sélectionner dates";
  };

  const offers = [
    {
      id: 1,
      destination: "Sarandë, Albanie",
      price: "87 €",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      destination: "Ksamil, Albanie",
      price: "106 €",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      destination: "Nerja, Espagne",
      price: "132 €",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      destination: "Milan, Italie",
      price: "133 €",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      destination: "Alghero, Italie",
      price: "136 €",
      image: "https://images.unsplash.com/photo-1624938263838-161ebb0811f7?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      destination: "Padoue, Italie",
      price: "140 €",
      image: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=300&fit=crop"
    },
    {
      id: 7,
      destination: "Durrës, Albanie",
      price: "140 €",
      image: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=400&h=300&fit=crop"
    },
    {
      id: 8,
      destination: "Lloret de Mar, Espagne",
      price: "141 €",
      image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400&h=300&fit=crop"
    },
    {
      id: 9,
      destination: "Vignola Mare, Italie",
      price: "145 €",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8">
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
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
            <span className="text-stone-200">Vols & Hôtels</span>
          </h1>
          <p className="text-lg md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Réservez vos vols et hôtels ensemble pour des économies garanties
          </p>
          
          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Départ</label>
                <input 
                  type="text" 
                  placeholder="Ville de départ"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Ville de destination"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
              <div className="relative md:col-span-2">
                <label className="block text-sm font-semibold text-green-800 mb-2">Dates</label>
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-left bg-white"
                >
                  {getDateDisplay()}
                </button>
                
                {/* Calendar Popup */}
                {isCalendarOpen && (
                  <div className="fixed md:absolute md:top-full md:left-0 md:right-0 left-4 right-4 top-1/2 transform -translate-y-1/2 md:transform-none mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] p-4 min-w-[280px] max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      <div className="text-center font-semibold text-gray-600">Lun</div>
                      <div className="text-center font-semibold text-gray-600">Mar</div>
                      <div className="text-center font-semibold text-gray-600">Mer</div>
                      <div className="text-center font-semibold text-gray-600">Jeu</div>
                      <div className="text-center font-semibold text-gray-600">Ven</div>
                      <div className="text-center font-semibold text-gray-600">Sam</div>
                      <div className="text-center font-semibold text-gray-600">Dim</div>
                      
                      {/* Calendar days - simplified for demo */}
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i + 1;
                        const date = `2024-08-${day.toString().padStart(2, '0')}`;
                        const isSelected = date === selectedDates.start || date === selectedDates.end;
                        const isInRange = selectedDates.start && selectedDates.end && 
                                        date >= selectedDates.start && date <= selectedDates.end;
                        
                        return (
                          <button
                            key={i}
                            onClick={() => handleDateSelect(date)}
                            className={`p-2 rounded hover:bg-green-100 transition-colors text-gray-800 ${
                              isSelected ? 'bg-green-600 text-white' : 
                              isInRange ? 'bg-green-100 text-gray-800' : 'text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Voyageurs</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                  <option>1 voyageur</option>
                  <option>2 voyageurs</option>
                  <option>3 voyageurs</option>
                  <option>4 voyageurs</option>
                  <option>5+ voyageurs</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Évadez-vous avec nos offres Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Évadez-vous avec nos offres</h2>
            <p className="text-xl text-gray-600 mb-2">Vol + Hôtel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={offer.image}
                      alt={offer.destination}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{offer.destination}</h3>
                      <p className="text-2xl font-bold text-stone-200">dès {offer.price}</p>
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
          <h2 className="text-4xl font-bold text-green-800 mb-4">Recherche Avancée Vols & Hôtels</h2>
          <p className="text-lg text-gray-600 mb-8">
            Utilisez nos filtres avancés pour trouver la meilleure combinaison vol + hôtel
          </p>
          <div className="bg-gradient-to-r from-green-50 to-stone-50 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Départ</label>
                <input 
                  type="text" 
                  placeholder="Aéroport de départ"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Aéroport d'arrivée"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Voyageurs</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                  <option>1 voyageur</option>
                  <option>2 voyageurs</option>
                  <option>3 voyageurs</option>
                  <option>4+ voyageurs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Chambres</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                  <option>1 chambre</option>
                  <option>2 chambres</option>
                  <option>3 chambres</option>
                  <option>4+ chambres</option>
                </select>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Classe Vol</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                  <option>Économique</option>
                  <option>Premium Economy</option>
                  <option>Affaires</option>
                  <option>Première</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Catégorie Hôtel</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                  <option>Toutes catégories</option>
                  <option>2 étoiles</option>
                  <option>3 étoiles</option>
                  <option>4 étoiles</option>
                  <option>5 étoiles</option>
                </select>
              </div>
              <div className="flex items-center">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Rechercher
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
            <h2 className="text-4xl font-bold text-green-800 mb-4">Offres de la Semaine</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profitez de nos réductions exceptionnelles sur des packages vol + hôtel
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
            <h2 className="text-4xl font-bold text-green-800 mb-4">Hôtels d&apos;Exception</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Séjournez dans des établissements uniques et luxueux
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-transform duration-300 ${
              isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}>
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextHotel}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
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
          <h2 className="text-4xl font-bold mb-6">Prêt à partir à l&apos;aventure ?</h2>
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
              S&apos;inscrire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 