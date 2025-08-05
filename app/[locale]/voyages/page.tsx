"use client"
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import Image from "next/image";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from "@/components/Calendar";

interface Airport {
  iataCode: string
  name: string
  city: string
  country: string
}

export default function Voyages() {
  const t = useTranslations('voyages');
  const locale = useLocale();
  const router = useRouter();
  const [searchType, setSearchType] = useState('flights');

  // États pour le formulaire de vols (exactement comme dans /vols)
  const [flightForm, setFlightForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    tripType: 'roundtrip' as 'roundtrip' | 'oneway',
    cabinClass: 'economy'
  });

  // États pour les dropdowns et recherche d'aéroports
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [filteredOriginAirports, setFilteredOriginAirports] = useState<Airport[]>([]);
  const [filteredDestinationAirports, setFilteredDestinationAirports] = useState<Airport[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [hotelForm, setHotelForm] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 2,
      children: 0
    },
    rooms: 1
  });

  const [activityForm, setActivityForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    participants: 2,
    categoryIds: [] as string[]
  });

  // Fonctions de recherche d'aéroports (copiées de /vols)
  const handleOriginSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setFilteredOriginAirports([]);
      return;
    }

    try {
      const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredOriginAirports(data.airports || []);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'aéroports:', error);
    }
  }, []);

  const handleDestinationSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setFilteredDestinationAirports([]);
      return;
    }

    try {
      const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredDestinationAirports(data.airports || []);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'aéroports:', error);
    }
  }, []);

  const selectOriginAirport = (airport: Airport) => {
    setFlightForm(prev => ({ ...prev, origin: airport.iataCode }));
    setShowOriginDropdown(false);
  };

  const selectDestinationAirport = (airport: Airport) => {
    setFlightForm(prev => ({ ...prev, destination: airport.iataCode }));
    setShowDestinationDropdown(false);
  };

  const handleDateSelect = (date: string, type: 'departure' | 'return') => {
    if (type === 'departure') {
      setFlightForm(prev => ({ ...prev, departureDate: date }));
    } else {
      setFlightForm(prev => ({ ...prev, returnDate: date }));
    }
  };

  const getDisplayValue = (iataCode: string) => {
    // Logique pour afficher le nom de l'aéroport au lieu du code IATA
    return iataCode;
  };

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (showOriginDropdown && !target.closest('.origin-dropdown-container')) {
        setShowOriginDropdown(false);
      }
      
      if (showDestinationDropdown && !target.closest('.destination-dropdown-container')) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOriginDropdown, showDestinationDropdown]);

  const travelCategories = [
    {
      id: 'flights',
      title: t('flights'),
      description: t('flightsDescription'),
      icon: '✈️',
      href: `/${locale}/voyages/vols`,
      color: 'from-blue-500 to-blue-600',
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"
    },
    {
      id: 'hotels',
      title: t('hotels'),
      description: t('hotelsDescription'),
      icon: '🏨',
      href: `/${locale}/voyages/hotels`,
      color: 'from-green-500 to-green-600',
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
    },
    {
      id: 'activities',
      title: t('activities'),
      description: t('activitiesDescription'),
      icon: '🎯',
      href: `/${locale}/voyages/activites`,
      color: 'from-purple-500 to-purple-600',
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
    }
  ];

  const stats = [
    { number: "2M+", label: "Voyageurs satisfaits" },
    { number: "150+", label: "Destinations" },
    { number: "24/7", label: "Support client" },
    { number: "95%", label: "Taux de satisfaction" }
  ];

  const destinations = [
    {
      name: "Paris, France",
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "La ville de l'amour et de la culture"
    },
    {
      name: "Tokyo, Japon",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      description: "Mélange parfait de tradition et modernité"
    },
    {
      name: "New York, USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      description: "La ville qui ne dort jamais"
    },
    {
      name: "Bali, Indonésie",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      description: "Paradis tropical et spiritualité"
    }
  ];

  const handleSearch = () => {
    const baseUrl = `/${locale}/voyages`;
    
    switch (searchType) {
      case 'flights':
        const flightParams = new URLSearchParams({
          origin: flightForm.origin,
          destination: flightForm.destination,
          departureDate: flightForm.departureDate,
          returnDate: flightForm.returnDate,
          adults: flightForm.passengers.adults.toString(),
          children: flightForm.passengers.children.toString(),
          infants: flightForm.passengers.infants.toString(),
          tripType: flightForm.tripType,
          cabinClass: flightForm.cabinClass
        });
        router.push(`${baseUrl}/vols?${flightParams.toString()}`);
        break;
        
      case 'hotels':
        const hotelParams = new URLSearchParams({
          destination: hotelForm.destination,
          checkIn: hotelForm.checkIn,
          checkOut: hotelForm.checkOut,
          adults: hotelForm.guests.adults.toString(),
          children: hotelForm.guests.children.toString(),
          rooms: hotelForm.rooms.toString()
        });
        router.push(`${baseUrl}/hotels?${hotelParams.toString()}`);
        break;
        
      case 'activities':
        const activityParams = new URLSearchParams({
          destination: activityForm.destination,
          startDate: activityForm.startDate,
          endDate: activityForm.endDate,
          participants: activityForm.participants.toString(),
          categoryIds: activityForm.categoryIds.join(',')
        });
        router.push(`${baseUrl}/activites?${activityParams.toString()}`);
        break;
    }
  };

  const renderSearchForm = () => {
    switch (searchType) {
      case 'flights':
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="form-container rounded-2xl p-4 md:p-8 mb-8">
            {/* Type de voyage */}
            <div className="flex gap-2 md:gap-4 mb-6">
              <button
                type="button"
                onClick={() => setFlightForm(prev => ({ ...prev, tripType: 'roundtrip' }))}
                className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  flightForm.tripType === 'roundtrip'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aller-retour
              </button>
              <button
                type="button"
                onClick={() => setFlightForm(prev => ({ ...prev, tripType: 'oneway' }))}
                className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  flightForm.tripType === 'oneway'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aller simple
              </button>
            </div>

            {/* Première ligne : Départ, Arrivée, Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {/* Ville de départ */}
              <div className="origin-dropdown-container relative">
                <label className="block text-sm font-semibold text-green-800 mb-2">De</label>
                <input
                  type="text"
                  placeholder="De"
                  value={flightForm.origin.startsWith('ALL_') ? getDisplayValue(flightForm.origin) : flightForm.origin}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFlightForm(prev => ({ ...prev, origin: value }));
                    
                    if (value.length >= 2 && !/^[A-Z]{3}$/.test(value) && !value.startsWith('ALL_')) {
                      setShowOriginDropdown(true);
                      handleOriginSearch(value);
                    } else {
                      setShowOriginDropdown(false);
                      setFilteredOriginAirports([]);
                    }
                  }}
                  onFocus={() => {
                    if (flightForm.origin && flightForm.origin.length >= 2 && !flightForm.origin.startsWith('ALL_')) {
                      setShowOriginDropdown(true);
                      handleOriginSearch(flightForm.origin);
                    }
                  }}
                  className="input-field w-full h-10 md:h-12 px-3 md:px-4 text-sm md:text-base rounded-lg text-black transition-all"
                />
                
                {showOriginDropdown && filteredOriginAirports.length > 0 && (
                  <div className="dropdown-menu absolute z-50 w-full mt-1 rounded-lg max-h-60 overflow-y-auto">
                    {filteredOriginAirports.map((airport, index) => (
                      <button
                        key={`origin-${airport.iataCode}-${index}`}
                        onClick={() => selectOriginAirport(airport)}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {airport.iataCode.startsWith('ALL_') ? '🏢' : '✈️'}
                          </span>
                          <div>
                            <div className="font-medium text-black">
                              {airport.iataCode.startsWith('ALL_') 
                                ? `Tous les aéroports de ${airport.city}`
                                : airport.name
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              {airport.iataCode.startsWith('ALL_') 
                                ? airport.country
                                : `${airport.city}, ${airport.country} (${airport.iataCode})`
                              }
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ville d'arrivée */}
              <div className="destination-dropdown-container relative">
                <label className="block text-sm font-semibold text-green-800 mb-2">Vers</label>
                <input
                  type="text"
                  placeholder="Vers"
                  value={flightForm.destination.startsWith('ALL_') ? getDisplayValue(flightForm.destination) : flightForm.destination}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFlightForm(prev => ({ ...prev, destination: value }));
                    
                    if (value.length >= 2 && !/^[A-Z]{3}$/.test(value) && !value.startsWith('ALL_')) {
                      setShowDestinationDropdown(true);
                      handleDestinationSearch(value);
                    } else {
                      setShowDestinationDropdown(false);
                      setFilteredDestinationAirports([]);
                    }
                  }}
                  onFocus={() => {
                    if (flightForm.destination && flightForm.destination.length >= 2 && !flightForm.destination.startsWith('ALL_')) {
                      setShowDestinationDropdown(true);
                      handleDestinationSearch(flightForm.destination);
                    }
                  }}
                  className="w-full h-10 md:h-12 px-3 md:px-4 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white transition-all"
                />
                
                {showDestinationDropdown && filteredDestinationAirports.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDestinationAirports.map((airport, index) => (
                      <button
                        key={`destination-${airport.iataCode}-${index}`}
                        onClick={() => selectDestinationAirport(airport)}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {airport.iataCode.startsWith('ALL_') ? '🏢' : '✈️'}
                          </span>
                          <div>
                            <div className="font-medium text-black">
                              {airport.iataCode.startsWith('ALL_') 
                                ? `Tous les aéroports de ${airport.city}`
                                : airport.name
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              {airport.iataCode.startsWith('ALL_') 
                                ? airport.country
                                : `${airport.city}, ${airport.country} (${airport.iataCode})`
                              }
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sélection des dates */}
              <div className="lg:col-span-2 calendar-container">
                <label className="block text-sm font-semibold text-green-800 mb-2">Dates</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-left bg-white hover:bg-gray-50 transition-all"
                >
                  {flightForm.departureDate ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {new Date(flightForm.departureDate).toLocaleDateString('fr-FR')}
                        </span>
                        {flightForm.tripType === 'roundtrip' && flightForm.returnDate && (
                          <span className="ml-2 text-sm text-gray-600">
                            → {new Date(flightForm.returnDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Sélectionner les dates</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Deuxième ligne : Passagers et Classe */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Passagers */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-green-800 mb-2">Passagers</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Adultes (18+)</label>
                    <select
                      value={flightForm.passengers.adults}
                      onChange={(e) => setFlightForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, adults: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = flightForm.passengers.children + flightForm.passengers.infants;
                        const maxAdults = Math.min(9 - currentTotal, 9);
                        return Array.from({length: maxAdults}, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Enfants (2-17)</label>
                    <select
                      value={flightForm.passengers.children}
                      onChange={(e) => setFlightForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, children: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = flightForm.passengers.adults + flightForm.passengers.infants;
                        const maxChildren = Math.max(0, 9 - currentTotal);
                        return Array.from({length: maxChildren + 1}, (_, i) => i).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Bébés (0-1)</label>
                    <select
                      value={flightForm.passengers.infants}
                      onChange={(e) => setFlightForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, infants: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = flightForm.passengers.adults + flightForm.passengers.children;
                        const maxInfants = Math.min(
                          Math.max(0, 9 - currentTotal),
                          flightForm.passengers.adults
                        );
                        return Array.from({length: maxInfants + 1}, (_, i) => i).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <div className={`font-medium ${flightForm.passengers.adults + flightForm.passengers.children + flightForm.passengers.infants > 9 ? 'text-red-600' : 'text-green-700'}`}>
                    Total: {flightForm.passengers.adults + flightForm.passengers.children + flightForm.passengers.infants} passager{(flightForm.passengers.adults + flightForm.passengers.children + flightForm.passengers.infants) > 1 ? 's' : ''} 
                    <span className="text-xs text-gray-500 ml-1 font-normal">(max 9)</span>
                  </div>
                  {flightForm.passengers.infants > 0 && (
                    <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Les bébés voyagent sur les genoux d&apos;un adulte</span>
                    </div>
                  )}
                  {flightForm.passengers.adults + flightForm.passengers.children + flightForm.passengers.infants > 9 && (
                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>🚫</span>
                      <span>Maximum 9 passagers autorisés par recherche</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Classe */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Classe</label>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Classe</label>
                  <select
                    value={flightForm.cabinClass}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, cabinClass: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                  >
                    <option value="economy">Économique</option>
                    <option value="premium_economy">Premium Économique</option>
                    <option value="business">Affaires</option>
                    <option value="first">Première</option>
                  </select>
                </div>
              </div>
            </div>
              
            {/* Calendrier en overlay complet */}
            {showCalendar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 calendar-container px-2 py-4">
                <div className="relative">
                  <Calendar
                    selectedDates={{
                      departure: flightForm.departureDate || '',
                      return: flightForm.returnDate || ''
                    }}
                    onDateSelect={handleDateSelect}
                    tripType={flightForm.tripType}
                    minDate={(() => {
                      const dayAfterTomorrow = new Date();
                      dayAfterTomorrow.setDate(new Date().getDate() + 2);
                      return dayAfterTomorrow.toISOString().split('T')[0];
                    })()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="absolute -top-4 left-31 md:-top-2 md:-right-2 md:left-auto bg-white rounded-full p-1.5 md:p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Bouton de recherche */}
            <div className="mt-6 md:mt-8">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors"
              >
                Rechercher des vols
              </button>
            </div>
          </form>
        );

      case 'hotels':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="Où voulez-vous séjourner ?"
                value={hotelForm.destination}
                onChange={(e) => setHotelForm({...hotelForm, destination: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Arrivée
                </label>
                <input
                  type="date"
                  value={hotelForm.checkIn}
                  onChange={(e) => setHotelForm({...hotelForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Départ
                </label>
                <input
                  type="date"
                  value={hotelForm.checkOut}
                  onChange={(e) => setHotelForm({...hotelForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adultes
                </label>
                <select
                  value={hotelForm.guests.adults}
                  onChange={(e) => setHotelForm({
                    ...hotelForm, 
                    guests: {...hotelForm.guests, adults: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enfants
                </label>
                <select
                  value={hotelForm.guests.children}
                  onChange={(e) => setHotelForm({
                    ...hotelForm, 
                    guests: {...hotelForm.guests, children: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[0,1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chambres
                </label>
                <select
                  value={hotelForm.rooms}
                  onChange={(e) => setHotelForm({...hotelForm, rooms: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="Où voulez-vous faire des activités ?"
                value={activityForm.destination}
                onChange={(e) => setActivityForm({...activityForm, destination: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={activityForm.startDate}
                  onChange={(e) => setActivityForm({...activityForm, startDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={activityForm.endDate}
                  onChange={(e) => setActivityForm({...activityForm, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de participants
              </label>
              <select
                value={activityForm.participants}
                onChange={(e) => setActivityForm({...activityForm, participants: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50 pt-20">
      {/* Hero Section avec formulaires de recherche */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaires de recherche */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <button
                onClick={() => setSearchType('flights')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  searchType === 'flights' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✈️ {t('flights')}
              </button>
              <button
                onClick={() => setSearchType('hotels')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  searchType === 'hotels' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏨 {t('hotels')}
              </button>
              <button
                onClick={() => setSearchType('activities')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  searchType === 'activities' 
                    ? 'bg-green-600 text-white w-full md:w-auto' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 w-full md:w-auto'
                }`}
              >
                🎯 {t('activities')}
              </button>
            </div>

            {renderSearchForm()}
          </div>
        </div>
      </section>

      {/* Section Destinations populaires */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Destinations populaires
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos destinations les plus appréciées par nos voyageurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-green-800 mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              {t('chooseCategory')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('categoryDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelCategories.map((category) => (
              <Link 
                key={category.id}
                href={category.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 text-4xl">{category.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 group-hover:text-green-700 transition-colors font-medium">
                        {t('explore')}
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('whyChooseUsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-800">{t('bestPrices')}</h3>
              <p className="text-gray-600">{t('bestPricesDescription')}</p>
            </div>

            <div className="text-center">
              <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-800">{t('secureBooking')}</h3>
              <p className="text-gray-600">{t('secureBookingDescription')}</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-800">{t('personalizedService')}</h3>
              <p className="text-gray-600">{t('personalizedServiceDescription')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Ce que disent nos voyageurs
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les expériences de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Marie Dubois</h4>
                  <p className="text-sm text-gray-600">Paris → Tokyo</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Service exceptionnel ! Mon voyage au Japon était parfait, de la réservation jusqu&apos;au retour.&quot;</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">P</span>
                </div>
                <div>
                  <h4 className="font-semibold">Pierre Martin</h4>
                  <p className="text-sm text-gray-600">Lyon → Bali</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Prix imbattables et conseils personnalisés. Je recommande vivement !&quot;</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sophie Bernard</h4>
                  <p className="text-sm text-gray-600">Marseille → New York</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Une expérience de voyage incroyable. L&apos;équipe a pensé à tout !&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">{t('readyToTravel')}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('readyToTravelDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${locale}/generateur`}
              className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('planMyTrip')}
            </Link>
            <Link 
              href={`/${locale}/salon-vip`}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors"
            >
              {t('vipService')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 