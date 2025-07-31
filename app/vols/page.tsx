"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Calendar from "@/components/Calendar"

interface Airport {
  iataCode: string
  name: string
  city: string
  country: string
}

interface FlightSegment {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  origin: string
  originName: string
  destination: string
  destinationName: string
  departure: string
  arrival: string
  duration: string
  aircraft?: string
  cabinClass: string
}

interface FlightSlice {
  origin: string
  destination: string
  departure: string
  arrival: string
  duration: string
  segments: FlightSegment[]
  hasStops: boolean
}

interface Flight {
  id: string
  totalPrice: string
  currency: string
  validUntil: string
  originName: string
  originCity: string
  destinationName: string
  destinationCity: string
  slices: FlightSlice[]
}

interface FlightMetadata {
  priceRange: { min: number; max: number }
  durationRange: { min: number; max: number }
  airlines: string[]
  hasDirectFlights: boolean
  hasConnectingFlights: boolean
}

interface SearchFilters {
  sortBy: 'price' | 'duration' | 'departure'
  priceRange: { min: number; max: number }
  flightType: 'all' | 'direct' | 'stops'
  departureTimeRange: { start: string; end: string }
  returnTimeRange: { start: string; end: string }
  selectedAirlines: string[]
}

export default function VolsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Images pour le carrousel d'arrière-plan
  const heroImages = [
    "https://images.unsplash.com/photo-1718948740023-ebb6e6f9cf6e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1479209749439-1f3a483ad0bc?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  const [searchForm, setSearchForm] = useState({
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
  })

  const [allFlights, setAllFlights] = useState<Flight[]>([])
  const [metadata, setMetadata] = useState<FlightMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'price',
    priceRange: { min: 0, max: 10000 },
    flightType: 'all',
    departureTimeRange: { start: '00:00', end: '23:59' },
    returnTimeRange: { start: '00:00', end: '23:59' },
    selectedAirlines: []
  })
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [filteredOriginAirports, setFilteredOriginAirports] = useState<Airport[]>([])
  const [filteredDestinationAirports, setFilteredDestinationAirports] = useState<Airport[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const FLIGHTS_PER_PAGE = 20

  // Auto-changement des images du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000) // Réduction à 3 secondes pour un cycle plus rapide
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Optimisation du filtrage avec useMemo
  const filteredFlights = useMemo(() => {
    if (!allFlights.length) return []

    let filtered = [...allFlights]

    // Filtrage par prix
    filtered = filtered.filter(flight => {
      const price = parseFloat(flight.totalPrice)
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })

    // Filtrage par type de vol
    if (filters.flightType === 'direct') {
      filtered = filtered.filter(flight => 
        flight.slices.every(slice => !slice.hasStops)
      )
    } else if (filters.flightType === 'stops') {
      filtered = filtered.filter(flight => 
        flight.slices.some(slice => slice.hasStops)
      )
    }

    // Filtrage par heure de départ
    filtered = filtered.filter(flight => {
      const departureTime = new Date(flight.slices[0].departure).toTimeString().substring(0, 5)
      return departureTime >= filters.departureTimeRange.start && departureTime <= filters.departureTimeRange.end
    })

    // Filtrage par heure de retour (si aller-retour)
    if (searchForm.tripType === 'roundtrip') {
      filtered = filtered.filter(flight => {
        if (flight.slices.length < 2) return false
        const returnTime = new Date(flight.slices[1].departure).toTimeString().substring(0, 5)
        return returnTime >= filters.returnTimeRange.start && returnTime <= filters.returnTimeRange.end
      })
    }

    // Filtrage par compagnies
    if (filters.selectedAirlines.length > 0) {
      filtered = filtered.filter(flight =>
        flight.slices.some(slice =>
          slice.segments.some(segment =>
            filters.selectedAirlines.includes(segment.airline)
          )
        )
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
        case 'duration':
          const getDuration = (flight: Flight) => {
            return flight.slices.reduce((total, slice) => {
              const match = slice.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
              const hours = parseInt(match?.[1] || '0')
              const minutes = parseInt(match?.[2] || '0')
              return total + (hours * 60) + minutes
            }, 0)
          }
          return getDuration(a) - getDuration(b)
        case 'departure':
          return new Date(a.slices[0].departure).getTime() - new Date(b.slices[0].departure).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [allFlights, filters, searchForm.tripType])

  // Pagination des résultats filtrés
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * FLIGHTS_PER_PAGE
    const endIndex = startIndex + FLIGHTS_PER_PAGE
    return filteredFlights.slice(startIndex, endIndex)
  }, [filteredFlights, currentPage])

  const totalPages = Math.ceil(filteredFlights.length / FLIGHTS_PER_PAGE)

  // Reset de la page quand on change de filtres
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Fermer le calendrier
      if (showCalendar && !target.closest('.calendar-container')) {
        setShowCalendar(false)
      }
      
      // Fermer les dropdowns d'aéroports
      if (showOriginDropdown && !target.closest('.origin-dropdown-container')) {
        setShowOriginDropdown(false)
      }
      
      if (showDestinationDropdown && !target.closest('.destination-dropdown-container')) {
        setShowDestinationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCalendar, showOriginDropdown, showDestinationDropdown])

  // Fonctions de recherche d'aéroports optimisées avec useCallback
  const handleOriginSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setFilteredOriginAirports([])
      return
    }

    try {
      const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Données origine reçues:', data)
        setFilteredOriginAirports(data.airports || [])
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'aéroports:', error)
    }
  }, [])

  const handleDestinationSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setFilteredDestinationAirports([])
      return
    }

    try {
      const response = await fetch(`/api/flights/airports?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Données destination reçues:', data)
        setFilteredDestinationAirports(data.airports || [])
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'aéroports:', error)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (searchForm.tripType === 'roundtrip' && !searchForm.returnDate) {
      setError('Veuillez sélectionner une date de retour')
      return
    }

    // Validation des passagers
    const totalPassengers = searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants
    if (totalPassengers === 0) {
      setError('Veuillez sélectionner au moins un passager')
      return
    }

    if (totalPassengers > 9) {
      setError('Maximum 9 passagers autorisés par recherche')
      return
    }

    if (searchForm.passengers.adults === 0) {
      setError('Au moins un adulte est requis')
      return
    }

    if (searchForm.passengers.infants > searchForm.passengers.adults) {
      setError('Le nombre de bébés ne peut pas dépasser le nombre d\'adultes')
      return
    }

    // Vérifier que l'origine et la destination sont des codes IATA valides
    const isValidIATA = (code: string) => {
      return code.startsWith('ALL_') || /^[A-Z]{3}$/.test(code)
    }

    if (!isValidIATA(searchForm.origin)) {
      setError('Veuillez sélectionner un aéroport de départ dans la liste')
      return
    }

    if (!isValidIATA(searchForm.destination)) {
      setError('Veuillez sélectionner un aéroport d\'arrivée dans la liste')
      return
    }

    console.log('Formulaire de recherche:', searchForm)
    setIsLoading(true)
    setError('')
    setAllFlights([])
    setMetadata(null)

    try {
      // Construction des passagers au format Duffel
      const passengers = []
      
      // Ajouter les adultes
      for (let i = 0; i < searchForm.passengers.adults; i++) {
        passengers.push({ type: 'adult' })
      }
      
      // Ajouter les enfants (avec âge par défaut de 10 ans)
      for (let i = 0; i < searchForm.passengers.children; i++) {
        passengers.push({ age: 10 }) // Duffel déterminera automatiquement que c'est un enfant
      }
      
      // Ajouter les bébés (avec âge de 1 an)
      for (let i = 0; i < searchForm.passengers.infants; i++) {
        passengers.push({ age: 1 }) // Duffel déterminera automatiquement que c'est un bébé
      }

      const requestBody = {
        origin: searchForm.origin,
        destination: searchForm.destination,
        departureDate: searchForm.departureDate,
        passengers: passengers,
        cabinClass: searchForm.cabinClass,
        ...(searchForm.tripType === 'roundtrip' && searchForm.returnDate && {
          returnDate: searchForm.returnDate
        })
      }

      console.log('Envoi de la requête:', requestBody)

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Statut de la réponse:', response.status)
      console.log('Headers de la réponse:', response.headers)

      if (response.ok) {
        const data = await response.json()
        console.log('Réponse reçue:', data)
        setAllFlights(data.flights || [])
        setMetadata(data.metadata || null)
        setSearchPerformed(true)
        
        // Initialiser les filtres avec les valeurs metadata
        if (data.metadata) {
          setFilters(prev => ({
            ...prev,
            priceRange: { 
              min: data.metadata.priceRange.min, 
              max: data.metadata.priceRange.max 
            }
          }))
        }
      } else {
        const errorData = await response.json()
        console.error('Erreur de l\'API:', errorData)
        
        if (errorData.message) {
          setError(errorData.message)
        } else {
          setError('Erreur lors de la recherche de vols. Veuillez réessayer.')
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion. Veuillez vérifier votre connexion internet.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions utilitaires
  const getDisplayValue = (iataCode: string) => {
    if (iataCode.startsWith('ALL_')) {
      const cityName = iataCode.replace('ALL_', '').replace('_', ' ')
      return `Tous les aéroports de ${cityName}`
    }
    const airport = [...filteredOriginAirports, ...filteredDestinationAirports].find(a => a.iataCode === iataCode)
    return airport ? `${airport.name} (${airport.iataCode})` : iataCode
  }

  const selectOriginAirport = (airport: Airport) => {
    setSearchForm(prev => ({ ...prev, origin: airport.iataCode }))
    setShowOriginDropdown(false)
    setFilteredOriginAirports([])
  }

  const selectDestinationAirport = (airport: Airport) => {
    setSearchForm(prev => ({ ...prev, destination: airport.iataCode }))
    setShowDestinationDropdown(false)
    setFilteredDestinationAirports([])
  }

  const handleDateSelect = (date: string, type: 'departure' | 'return') => {
    // Empêcher la propagation d'événements qui pourraient déclencher une soumission
    setSearchForm(prev => {
      const newForm = { ...prev }
      
      if (type === 'departure') {
        newForm.departureDate = date
        // Si on change la date de départ et qu'on a déjà une date de retour,
        // vérifier que la date de retour est toujours valide
        if (newForm.returnDate && new Date(date) >= new Date(newForm.returnDate)) {
          newForm.returnDate = '' // Reset la date de retour si elle devient invalide
        }
      } else {
        newForm.returnDate = date
      }
      
      // Fermer le calendrier seulement si :
      // - Aller simple et date de départ sélectionnée
      // - Aller-retour et les deux dates sélectionnées
      if (prev.tripType === 'oneway' && type === 'departure') {
        setTimeout(() => setShowCalendar(false), 100)
      } else if (prev.tripType === 'roundtrip' && type === 'return' && newForm.departureDate) {
        setTimeout(() => setShowCalendar(false), 100)
      }
      
      return newForm
    })
  }

  const formatPrice = (price: string, currency: string) => {
    const numericPrice = parseFloat(price)
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(numericPrice)
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    const hours = match?.[1] ? parseInt(match[1]) : 0
    const minutes = match?.[2] ? parseInt(match[2]) : 0
    
    if (hours === 0) {
      return `${minutes}min`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}min`
    }
  }

  // Fonction pour calculer la durée totale d'un slice basée sur les heures réelles
  const calculateSliceDuration = (slice: FlightSlice) => {
    // Si la durée est fournie et valide, l'utiliser
    if (slice.duration && slice.duration !== 'PT0M' && slice.duration !== 'PT0H0M') {
      return slice.duration
    }
    
    // Sinon, calculer la durée basée sur les heures de départ et d'arrivée
    const departure = new Date(slice.departure)
    const arrival = new Date(slice.arrival)
    const diffMs = arrival.getTime() - departure.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    
    if (hours === 0) {
      return `PT${minutes}M`
    } else if (minutes === 0) {
      return `PT${hours}H`
    } else {
      return `PT${hours}H${minutes}M`
    }
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Section Hero avec formulaire de recherche */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Carrousel d'images première classe - système d'opacité */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Image première classe ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 z-10 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-green-50/60 to-white/30 z-10"></div>
            </div>
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto z-20">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
              Trouvez vos vols parfaits
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Comparez et réservez les meilleurs vols au meilleur prix
            </p>
          </div>

          {/* Formulaire de recherche */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mb-8">
            {/* Type de voyage */}
            <div className="flex gap-2 md:gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSearchForm(prev => ({ ...prev, tripType: 'roundtrip' }))}
                className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  searchForm.tripType === 'roundtrip'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aller-retour
              </button>
              <button
                type="button"
                onClick={() => setSearchForm(prev => ({ ...prev, tripType: 'oneway' }))}
                className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                  searchForm.tripType === 'oneway'
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
                <label className="block text-sm font-semibold text-green-800 mb-2">Départ</label>
                <input
                  type="text"
                  placeholder="Ville de départ"
                  value={searchForm.origin.startsWith('ALL_') ? getDisplayValue(searchForm.origin) : searchForm.origin}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchForm(prev => ({ ...prev, origin: value }))
                    
                    // Si l'utilisateur tape après avoir sélectionné un code IATA, on réinitialise
                    if (value.length >= 2 && !/^[A-Z]{3}$/.test(value) && !value.startsWith('ALL_')) {
                      setShowOriginDropdown(true)
                      handleOriginSearch(value)
                    } else {
                      setShowOriginDropdown(false)
                      setFilteredOriginAirports([])
                    }
                  }}
                  onFocus={() => {
                    if (searchForm.origin && searchForm.origin.length >= 2 && !searchForm.origin.startsWith('ALL_')) {
                      setShowOriginDropdown(true)
                      handleOriginSearch(searchForm.origin)
                    }
                  }}
                  className="w-full h-10 md:h-12 px-3 md:px-4 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white transition-all"
                />
                
                {showOriginDropdown && filteredOriginAirports.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                <label className="block text-sm font-semibold text-green-800 mb-2">Arrivée</label>
                <input
                  type="text"
                  placeholder="Ville d'arrivée"
                  value={searchForm.destination.startsWith('ALL_') ? getDisplayValue(searchForm.destination) : searchForm.destination}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchForm(prev => ({ ...prev, destination: value }))
                    
                    // Si l'utilisateur tape après avoir sélectionné un code IATA, on réinitialise
                    if (value.length >= 2 && !/^[A-Z]{3}$/.test(value) && !value.startsWith('ALL_')) {
                      setShowDestinationDropdown(true)
                      handleDestinationSearch(value)
                    } else {
                      setShowDestinationDropdown(false)
                      setFilteredDestinationAirports([])
                    }
                  }}
                  onFocus={() => {
                    if (searchForm.destination && searchForm.destination.length >= 2 && !searchForm.destination.startsWith('ALL_')) {
                      setShowDestinationDropdown(true)
                      handleDestinationSearch(searchForm.destination)
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
                  {searchForm.departureDate ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {new Date(searchForm.departureDate).toLocaleDateString('fr-FR')}
                        </span>
                        {searchForm.tripType === 'roundtrip' && searchForm.returnDate && (
                          <span className="ml-2 text-sm text-gray-600">
                            → {new Date(searchForm.returnDate).toLocaleDateString('fr-FR')}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
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
                      value={searchForm.passengers.adults}
                      onChange={(e) => setSearchForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, adults: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = searchForm.passengers.children + searchForm.passengers.infants
                        const maxAdults = Math.min(9 - currentTotal, 9)
                        return Array.from({length: maxAdults}, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))
                      })()}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Enfants (2-17)</label>
                    <select
                      value={searchForm.passengers.children}
                      onChange={(e) => setSearchForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, children: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = searchForm.passengers.adults + searchForm.passengers.infants
                        const maxChildren = Math.max(0, 9 - currentTotal)
                        return Array.from({length: maxChildren + 1}, (_, i) => i).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))
                      })()}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Bébés (0-1)</label>
                    <select
                      value={searchForm.passengers.infants}
                      onChange={(e) => setSearchForm(prev => ({ 
                        ...prev, 
                        passengers: { ...prev.passengers, infants: parseInt(e.target.value) }
                      }))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                    >
                      {(() => {
                        const currentTotal = searchForm.passengers.adults + searchForm.passengers.children
                        const maxInfants = Math.min(
                          Math.max(0, 9 - currentTotal), // Limite globale de 9
                          searchForm.passengers.adults    // Limite: 1 bébé par adulte
                        )
                        return Array.from({length: maxInfants + 1}, (_, i) => i).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))
                      })()}
                    </select>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <div className={`font-medium ${searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants > 9 ? 'text-red-600' : 'text-green-700'}`}>
                    Total: {searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants} passager{(searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants) > 1 ? 's' : ''} 
                    <span className="text-xs text-gray-500 ml-1 font-normal">(max 9)</span>
                  </div>
                  {searchForm.passengers.infants > 0 && (
                    <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Les bébés voyagent sur les genoux d&apos;un adulte</span>
                    </div>
                  )}
                  {searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants > 9 && (
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">Type de cabine</label>
                  <select
                    value={searchForm.cabinClass}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, cabinClass: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
                  >
                    <option value="economy">Économique</option>
                    <option value="premium_economy">Économique Premium</option>
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
                      departure: searchForm.departureDate || '',
                      return: searchForm.returnDate || ''
                    }}
                    onDateSelect={handleDateSelect}
                    tripType={searchForm.tripType}
                    minDate={(() => {
                      const dayAfterTomorrow = new Date()
                      dayAfterTomorrow.setDate(new Date().getDate() + 2)
                      return dayAfterTomorrow.toISOString().split('T')[0]
                    })()}
                  />
                  {/* Bouton fermer - haut gauche sur mobile, haut droite sur desktop */}
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
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Recherche en cours...
                  </div>
                ) : (
                  'Rechercher des vols'
                )}
              </button>
            </div>
          </form>
        </div>


      </section>

      {/* Section d'accueil avant recherche */}
      {!searchPerformed && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-16">
            
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-800 mb-6">
                Trouvez votre vol idéal
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comparez des milliers de vols et trouvez les meilleures offres pour votre prochaine destination. 
                Recherche rapide, prix transparents, réservation sécurisée.
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-green-800 mb-3">500+ Destinations</h3>
                <p className="text-gray-600 leading-relaxed">Volez vers le monde entier avec nos partenaires aériens de confiance</p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800 mb-3">Prix Garantis</h3>
                <p className="text-gray-600 leading-relaxed">Aucun frais caché, prix transparent dès la recherche initiale</p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-purple-800 mb-3">Réservation Sécurisée</h3>
                <p className="text-gray-600 leading-relaxed">Paiement protégé et confirmation instantanée garantie</p>
              </div>
            </div>

            {/* Destinations populaires */}
            <div className="bg-white rounded-2xl p-10 shadow-sm">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
                Destinations populaires
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { city: 'Paris', country: 'France', emoji: '🇫🇷', code: 'PAR' },
                  { city: 'Londres', country: 'Royaume-Uni', emoji: '🇬🇧', code: 'LON' },
                  { city: 'Tokyo', country: 'Japon', emoji: '🇯🇵', code: 'TYO' },
                  { city: 'New York', country: 'États-Unis', emoji: '🇺🇸', code: 'NYC' },
                  { city: 'Rome', country: 'Italie', emoji: '🇮🇹', code: 'ROM' },
                  { city: 'Barcelone', country: 'Espagne', emoji: '🇪🇸', code: 'BCN' }
                ].map((destination, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-xl p-6 text-center hover:bg-green-50 hover:shadow-md transition-all cursor-pointer group border border-gray-100"
                    onClick={() => {
                      setSearchForm(prev => ({ ...prev, destination: destination.code }))
                      setShowDestinationDropdown(false)
                      // Scroll vers le formulaire
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {destination.emoji}
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">
                      {destination.city}
                    </div>
                    <div className="text-sm text-gray-500">
                      {destination.country}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-10 text-center text-white shadow-lg">
              <h3 className="text-3xl font-bold mb-6">
                Prêt à partir à l&apos;aventure ?
              </h3>
              <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
                Remplissez le formulaire ci-dessus et découvrez les meilleures offres de vols disponibles. 
                Recherche en temps réel sur des centaines de compagnies aériennes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3 hover:bg-white/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">Recherche instantanée</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3 hover:bg-white/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Flexibilité totale</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3 hover:bg-white/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Paiement sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Résultats de recherche */}
      {searchPerformed && (
        <section className="py-8 md:py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            
            {/* Layout avec sidebar - responsive */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              
              {/* Sidebar des filtres - en haut sur mobile, à gauche sur desktop */}
              {metadata && !isLoading && (
                <aside className="w-full lg:w-80 lg:flex-shrink-0 order-1 lg:order-none">
                  <div className="lg:sticky lg:top-4 bg-gray-50 rounded-xl p-4 md:p-6 max-h-96 lg:max-h-screen overflow-y-auto">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Filtres de recherche</h3>
                    
                    <div className="space-y-6">
                      
                      {/* Tri */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                        <select 
                          value={filters.sortBy}
                          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'price' | 'duration' | 'departure' }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        >
                          <option value="price">Prix le plus bas</option>
                          <option value="duration">Trajet le plus court</option>
                          <option value="departure">Heure de départ</option>
                        </select>
                      </div>
                      
                      {/* Prix */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix: {filters.priceRange.min}€ - {filters.priceRange.max}€
                        </label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={metadata.priceRange.min}
                            max={metadata.priceRange.max}
                            value={filters.priceRange.min}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              priceRange: { ...prev.priceRange, min: parseInt(e.target.value) }
                            }))}
                            className="w-full"
                          />
                          <input
                            type="range"
                            min={metadata.priceRange.min}
                            max={metadata.priceRange.max}
                            value={filters.priceRange.max}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                            }))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Type de vol */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type de vol</label>
                        <select 
                          value={filters.flightType}
                          onChange={(e) => setFilters(prev => ({ ...prev, flightType: e.target.value as 'all' | 'direct' | 'stops' }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                        >
                          <option value="all">Tous les vols</option>
                          <option value="direct">Vol direct seulement</option>
                          <option value="stops">Avec escales</option>
                        </select>
                      </div>

                      {/* Heure de départ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heure de départ</label>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={filters.departureTimeRange.start}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              departureTimeRange: { ...prev.departureTimeRange, start: e.target.value }
                            }))}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                          />
                          <input
                            type="time"
                            value={filters.departureTimeRange.end}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              departureTimeRange: { ...prev.departureTimeRange, end: e.target.value }
                            }))}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                          />
                        </div>
                      </div>

                      {/* Heure de retour (si aller-retour) */}
                      {searchForm.tripType === 'roundtrip' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Heure de retour</label>
                          <div className="flex gap-2">
                            <input
                              type="time"
                              value={filters.returnTimeRange.start}
                              onChange={(e) => setFilters(prev => ({ 
                                ...prev, 
                                returnTimeRange: { ...prev.returnTimeRange, start: e.target.value }
                              }))}
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                            />
                            <input
                              type="time"
                              value={filters.returnTimeRange.end}
                              onChange={(e) => setFilters(prev => ({ 
                                ...prev, 
                                returnTimeRange: { ...prev.returnTimeRange, end: e.target.value }
                              }))}
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                            />
                          </div>
                        </div>
                      )}

                      {/* Compagnies aériennes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Compagnies aériennes</label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
                          {metadata.airlines.map(airline => (
                            <label key={airline} className="flex items-center space-x-2 text-sm text-black">
                              <input
                                type="checkbox"
                                checked={filters.selectedAirlines.includes(airline)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFilters(prev => ({
                                      ...prev,
                                      selectedAirlines: [...prev.selectedAirlines, airline]
                                    }))
                                  } else {
                                    setFilters(prev => ({
                                      ...prev,
                                      selectedAirlines: prev.selectedAirlines.filter(a => a !== airline)
                                    }))
                                  }
                                }}
                                className="rounded text-green-600 focus:ring-green-500"
                              />
                              <span>{airline}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, selectedAirlines: [] }))}
                          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white cursor-pointer"
                        >
                          Effacer sélection
                        </button>
                        <button
                          onClick={() => {
                            setFilters({
                              sortBy: 'price',
                              priceRange: metadata ? { min: metadata.priceRange.min, max: metadata.priceRange.max } : { min: 0, max: 10000 },
                              flightType: 'all',
                              departureTimeRange: { start: '00:00', end: '23:59' },
                              returnTimeRange: { start: '00:00', end: '23:59' },
                              selectedAirlines: []
                            })
                          }}
                          className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white cursor-pointer"
                        >
                          Réinitialiser filtres
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              )}
              
              {/* Contenu principal */}
              <div className="flex-1 order-2 lg:order-none">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 mb-4">
                    {isLoading ? 'Recherche en cours...' : `Résultats (${filteredFlights.length} vols)`}
                  </h2>
                  
                  {/* Compteur et pagination */}
                  {!isLoading && filteredFlights.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                      <div className="text-gray-600 text-sm md:text-base">
                        {Math.min((currentPage - 1) * FLIGHTS_PER_PAGE + 1, filteredFlights.length)} à {Math.min(currentPage * FLIGHTS_PER_PAGE, filteredFlights.length)} sur {filteredFlights.length}
                      </div>
                      
                      {totalPages > 1 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                          >
                            ← Précédent
                          </button>
                          
                          <span className="px-3 py-1 bg-green-600 text-white rounded">
                            {currentPage} / {totalPages}
                          </span>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                          >
                            Suivant →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-red-800">{error}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isLoading && paginatedFlights.length > 0 && (
                  <div className="space-y-4 md:space-y-6">
                    {paginatedFlights.map((flight: Flight) => (
                      <div key={flight.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <div className="text-2xl md:text-3xl font-bold text-green-600">
                              {formatPrice(flight.totalPrice, flight.currency)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {flight.slices.length === 2 ? 'Aller-retour' : 'Aller simple'}
                            </div>
                          </div>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm md:text-base self-start md:self-auto">
                            Réserver
                          </button>
                        </div>

                        {/* Détails des vols */}
                        <div className="space-y-3 md:space-y-4">
                          {flight.slices.map((slice, sliceIndex) => (
                            <div key={sliceIndex} className="border border-gray-100 rounded-lg p-3 md:p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                <h4 className="font-semibold text-base md:text-lg text-black">
                                  {sliceIndex === 0 ? 'Aller' : 'Retour'}: {slice.segments[0].originName} → {slice.segments[slice.segments.length - 1].destinationName}
                                </h4>
                                <div className="text-xs md:text-sm text-black font-bold">
                                   Durée: {formatDuration(calculateSliceDuration(slice))}
                                   {slice.hasStops && <span className="ml-2 text-orange-600">({slice.segments.length - 1} escale{slice.segments.length > 2 ? 's' : ''})</span>}
                                 </div>
                              </div>
                              
                              <div className="space-y-2">
                                {slice.segments.map((segment) => (
                                  <div key={segment.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                      <div className="text-xs md:text-sm text-black">
                                        <div className="text-blue-600 font-bold">{segment.airline} {segment.flightNumber}</div>
                                        <div className="text-gray-600 hidden md:block">{segment.aircraft}</div>
                                      </div>
                                      <div className="text-xs md:text-sm text-black">
                                        <div className="font-medium">{formatTime(segment.departure)} - {formatTime(segment.arrival)}</div>
                                        <div className="text-gray-600">{segment.originName} → {segment.destinationName}</div>
                                      </div>
                                    </div>
                                    <div className="text-xs md:text-sm text-left md:text-right">
                                      <div className="text-black font-medium">{formatDuration(segment.duration)}</div>
                                      <div className="text-gray-600">{segment.cabinClass}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                  
                {/* Pagination en bas */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                        >
                          ← Précédent
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1
                          if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg ${
                                  page === currentPage 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-300 hover:bg-green-600'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          } else if (page === currentPage - 3 || page === currentPage + 3) {
                            return <span key={page} className="px-2 py-2">...</span>
                          }
                          return null
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  )}
                {!isLoading && filteredFlights.length === 0 && searchPerformed && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      Aucun vol trouvé pour votre recherche
                    </div>
                    <p className="text-gray-600">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 