import { NextRequest, NextResponse } from 'next/server'

const DUFFEL_API_URL = 'https://api.duffel.com/air/offer_requests'
const DUFFEL_TOKEN = process.env.DUFFEL_TOKEN

interface PassengerRequest {
  type?: 'adult'
  age?: number
}

interface FlightSearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: PassengerRequest[]
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first'
}

// Interfaces pour les types Duffel API
interface DuffelAirport {
  iata_code: string
  name: string
  city_name?: string
}

interface DuffelSegment {
  id: string
  marketing_carrier: {
    name: string
    iata_code: string
  }
  marketing_carrier_flight_number: string
  origin: DuffelAirport
  destination: DuffelAirport
  departing_at: string
  arriving_at: string
  duration: string
  aircraft?: {
    name: string
  }
  passenger_conditions?: {
    cabin_class: string
  }
}

interface DuffelSlice {
  origin: DuffelAirport
  destination: DuffelAirport
  duration: string
  segments: DuffelSegment[]
}

interface DuffelOffer {
  id: string
  total_amount: string
  total_currency: string
  expires_at: string
  slices: DuffelSlice[]
}

// Interface pour les vols transformés
interface TransformedFlight {
  id: string
  totalPrice: string
  currency: string
  validUntil: string
  slices: {
    origin: string
    originName: string
    originCity?: string
    destination: string
    destinationName: string
    destinationCity?: string
    departure: string
    arrival: string
    duration: string
    hasStops: boolean
    stopCount: number
    segments: {
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
    }[]
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchRequest = await request.json()
    const { origin, destination, departureDate, returnDate, passengers, cabinClass = 'economy' } = body
    
    console.log('Passagers reçus dans l\'API:', passengers)

    if (!origin || !destination || !departureDate || !passengers || passengers.length === 0) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Vérifier que les dates sont dans le futur (au minimum demain)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const depDate = new Date(departureDate)
    if (depDate <= tomorrow) {
      return NextResponse.json({ 
        error: 'La date de départ doit être au minimum dans 2 jours',
        details: `Date minimum acceptée: ${tomorrow.toISOString().split('T')[0]}`
      }, { status: 400 })
    }

    if (returnDate) {
      const retDate = new Date(returnDate)
      if (retDate <= depDate) {
        return NextResponse.json({ 
          error: 'La date de retour doit être après la date de départ'
        }, { status: 400 })
      }
    }

    // Vérifier si le token Duffel est configuré
    if (!DUFFEL_TOKEN || DUFFEL_TOKEN === 'your_duffel_token_here') {
      console.error('Token Duffel non configuré!')
      return NextResponse.json({ 
        error: 'Configuration manquante: Token Duffel non configuré',
        message: 'Veuillez configurer DUFFEL_TOKEN dans votre fichier .env.local'
      }, { status: 500 })
    }

    // Convertir les codes ALL_ en codes de ville ou garder l'aéroport spécifique
    let finalOrigin = origin
    let finalDestination = destination

    // Pour les codes ALL_, extraire le nom de la ville
    if (origin.startsWith('ALL_')) {
      // Essayer d'utiliser des codes de ville connus
      const cityName = origin.replace('ALL_', '').replace(/[^A-Z]/g, '')
      
      // Mapping des villes principales vers leurs codes IATA
      const cityToCode: { [key: string]: string } = {
        'PARIS': 'PAR',
        'LONDON': 'LON', 
        'NEWYORK': 'NYC',
        'TOKYO': 'TYO',
        'MADRID': 'MAD',
        'ROME': 'ROM',
        'MILAN': 'MIL',
        'BARCELONA': 'BCN',
        'AMSTERDAM': 'AMS',
        'FRANKFURT': 'FRA',
        'MUNICH': 'MUC'
      }
      
      finalOrigin = cityToCode[cityName] || origin.replace('ALL_', '')
    }

    if (destination.startsWith('ALL_')) {
      const cityName = destination.replace('ALL_', '').replace(/[^A-Z]/g, '')
      
      const cityToCode: { [key: string]: string } = {
        'PARIS': 'PAR',
        'LONDON': 'LON',
        'NEWYORK': 'NYC', 
        'TOKYO': 'TYO',
        'MADRID': 'MAD',
        'ROME': 'ROM',
        'MILAN': 'MIL',
        'BARCELONA': 'BCN',
        'AMSTERDAM': 'AMS',
        'FRANKFURT': 'FRA',
        'MUNICH': 'MUC'
      }
      
      finalDestination = cityToCode[cityName] || destination.replace('ALL_', '')
    }

    console.log('Recherche de vols:', { 
      originalOrigin: origin, 
      finalOrigin, 
      originalDestination: destination, 
      finalDestination, 
      departureDate, 
      returnDate, 
      passengers, 
      cabinClass 
    })

    // Préparer la requête pour Duffel
    const duffelRequest = {
      data: {
        slices: returnDate ? [
          {
            origin: finalOrigin,
            destination: finalDestination,
            departure_date: departureDate
          },
          {
            origin: finalDestination,
            destination: finalOrigin,
            departure_date: returnDate
          }
        ] : [
          {
            origin: finalOrigin,
            destination: finalDestination,
            departure_date: departureDate
          }
        ],
        passengers: passengers,
        cabin_class: cabinClass,
        max_connections: 2 // Permettre jusqu'à 2 escales
      }
    }

    console.log('Requête Duffel:', JSON.stringify(duffelRequest, null, 2))

    // Appeler l'API Duffel avec return_offers=true et timeout plus long
    const response = await fetch(`${DUFFEL_API_URL}?return_offers=true&supplier_timeout=45000`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_TOKEN}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      body: JSON.stringify(duffelRequest)
    })

    console.log('Statut réponse Duffel:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erreur Duffel API:', response.status, errorData)
      
      // Messages d'erreur plus clairs pour l'utilisateur
      let userMessage = 'Erreur lors de la recherche de vols'
      
      if (errorData.errors && errorData.errors.length > 0) {
        const firstError = errorData.errors[0]
        if (firstError.code === 'invalid_date') {
          userMessage = 'Date invalide: choisissez une date plus éloignée dans le futur'
        } else if (firstError.code === 'no_availability') {
          userMessage = 'Aucun vol disponible pour ces dates et destination'
        } else {
          userMessage = firstError.message || userMessage
        }
      }
      
      return NextResponse.json({ 
        error: userMessage,
        details: errorData,
        status: response.status
      }, { status: response.status })
    }

    const duffelData = await response.json()
    console.log('Réponse Duffel reçue, nombre d\'offres:', duffelData.data?.offers?.length || 0)

    if (!duffelData.data?.offers || duffelData.data.offers.length === 0) {
      return NextResponse.json({ 
        flights: [],
        totalResults: 0,
        message: 'Aucun vol trouvé pour ces critères de recherche'
      })
    }

    // Transformer les données Duffel en format plus simple
    const flights = duffelData.data.offers.map((offer: DuffelOffer) => ({
      id: offer.id,
      totalPrice: offer.total_amount,
      currency: offer.total_currency,
      validUntil: offer.expires_at,
      slices: offer.slices.map((slice: DuffelSlice) => ({
        origin: slice.origin.iata_code,
        originName: slice.origin.name,
        originCity: slice.origin.city_name,
        destination: slice.destination.iata_code,
        destinationName: slice.destination.name,
        destinationCity: slice.destination.city_name,
        departure: slice.segments[0]?.departing_at,
        arrival: slice.segments[slice.segments.length - 1]?.arriving_at,
        duration: slice.duration,
        hasStops: slice.segments.length > 1,
        stopCount: slice.segments.length - 1,
        segments: slice.segments.map((segment: DuffelSegment) => ({
          id: segment.id,
          airline: segment.marketing_carrier.name,
          airlineCode: segment.marketing_carrier.iata_code,
          flightNumber: segment.marketing_carrier_flight_number,
          origin: segment.origin.iata_code,
          originName: segment.origin.name,
          destination: segment.destination.iata_code,
          destinationName: segment.destination.name,
          departure: segment.departing_at,
          arrival: segment.arriving_at,
          duration: segment.duration,
          aircraft: segment.aircraft?.name,
          cabinClass: segment.passenger_conditions?.cabin_class || cabinClass
        }))
      }))
    }))

    // Trier les vols par prix (pas de filtrage automatique)
    flights.sort((a: TransformedFlight, b: TransformedFlight) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice))

    // Calculer les métadonnées pour les filtres
    const prices = flights.map((f: TransformedFlight) => parseFloat(f.totalPrice))
    const durations = flights.map((f: TransformedFlight) => {
      return f.slices.reduce((total: number, slice: TransformedFlight['slices'][0]) => {
        // Convertir duration "PT14H30M" en minutes
        const durationMatch = slice.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
        const hours = parseInt(durationMatch?.[1] || '0')
        const minutes = parseInt(durationMatch?.[2] || '0')
        return total + (hours * 60) + minutes
      }, 0)
    })
    
    const airlines = [...new Set(flights.flatMap((f: TransformedFlight) => 
      f.slices.flatMap((s: TransformedFlight['slices'][0]) => s.segments.map((seg: TransformedFlight['slices'][0]['segments'][0]) => seg.airline))
    ))].sort()

    const metadata = {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      durationRange: {
        min: Math.min(...durations),
        max: Math.max(...durations)
      },
      airlines,
      hasDirectFlights: flights.some((f: TransformedFlight) => f.slices.every((s: TransformedFlight['slices'][0]) => !s.hasStops)),
      hasConnectingFlights: flights.some((f: TransformedFlight) => f.slices.some((s: TransformedFlight['slices'][0]) => s.hasStops))
    }

    console.log(`Retour de ${flights.length} vols - Prix de ${metadata.priceRange.min}€ à ${metadata.priceRange.max}€`)
    console.log(`Durées de ${Math.floor(metadata.durationRange.min / 60)}h${metadata.durationRange.min % 60}m à ${Math.floor(metadata.durationRange.max / 60)}h${metadata.durationRange.max % 60}m`)
    console.log(`${airlines.length} compagnies: ${airlines.slice(0, 3).join(', ')}${airlines.length > 3 ? '...' : ''}`)

    return NextResponse.json({ 
      flights,
      totalResults: flights.length,
      metadata,
      searchInfo: {
        origin: finalOrigin,
        destination: finalDestination,
        departureDate,
        returnDate,
        passengers,
        cabinClass
      }
    })

  } catch (error) {
    console.error('Erreur lors de la recherche de vols:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la recherche de vols',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
} 