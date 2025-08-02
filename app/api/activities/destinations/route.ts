import { NextRequest, NextResponse } from 'next/server'

const VIATOR_API_URL = 'https://api.viator.com/partner/taxonomy/destinations'
const VIATOR_API_KEY = process.env.VIATOR_API_KEY

interface ViatorDestination {
  ref: number
  name: string
  destinationType: string
  country: string
  timeZone: string
  parentRef?: number
  lookupId: string
}

interface TransformedDestination {
  id: string
  name: string
  country: string
  type: string
  lookupId: string
  fullName: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    console.log('Recherche de destinations:', query)

    // Vérifier que la clé API Viator est configurée
    if (!VIATOR_API_KEY || VIATOR_API_KEY === 'your_viator_api_key_here') {
      console.error('Clé API Viator non configurée!')
      return NextResponse.json({ 
        error: 'Configuration manquante: Clé API Viator non configurée'
      }, { status: 500 })
    }

    // Si pas de query, retourner des destinations populaires
    if (query.length < 2) {
      const popularDestinations = [
        { id: 'PARIS', name: 'Paris', country: 'France', type: 'CITY', lookupId: 'PARIS', fullName: 'Paris, France' },
        { id: 'LONDON', name: 'Londres', country: 'Royaume-Uni', type: 'CITY', lookupId: 'LONDON', fullName: 'Londres, Royaume-Uni' },
        { id: 'ROME', name: 'Rome', country: 'Italie', type: 'CITY', lookupId: 'ROME', fullName: 'Rome, Italie' },
        { id: 'BARCELONA', name: 'Barcelone', country: 'Espagne', type: 'CITY', lookupId: 'BARCELONA', fullName: 'Barcelone, Espagne' },
        { id: 'AMSTERDAM', name: 'Amsterdam', country: 'Pays-Bas', type: 'CITY', lookupId: 'AMSTERDAM', fullName: 'Amsterdam, Pays-Bas' },
        { id: 'NEW_YORK', name: 'New York', country: 'États-Unis', type: 'CITY', lookupId: 'NEW_YORK', fullName: 'New York, États-Unis' },
        { id: 'TOKYO', name: 'Tokyo', country: 'Japon', type: 'CITY', lookupId: 'TOKYO', fullName: 'Tokyo, Japon' },
        { id: 'DUBAI', name: 'Dubaï', country: 'Émirats arabes unis', type: 'CITY', lookupId: 'DUBAI', fullName: 'Dubaï, Émirats arabes unis' }
      ]
      
      return NextResponse.json({ destinations: popularDestinations })
    }

    // Appeler l'API Viator pour récupérer les destinations
    const response = await fetch(VIATOR_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VIATOR_API_KEY}`,
        'Accept': 'application/json',
        'Accept-Version': 'v2'
      }
    })

    console.log('Statut réponse Viator destinations:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erreur API Viator destinations:', response.status, errorData)
      
      // En cas d'erreur, retourner des destinations de fallback qui matchent la recherche
      const fallbackDestinations = [
        { id: 'PARIS', name: 'Paris', country: 'France', type: 'CITY', lookupId: 'PARIS', fullName: 'Paris, France' },
        { id: 'LONDON', name: 'Londres', country: 'Royaume-Uni', type: 'CITY', lookupId: 'LONDON', fullName: 'Londres, Royaume-Uni' },
        { id: 'ROME', name: 'Rome', country: 'Italie', type: 'CITY', lookupId: 'ROME', fullName: 'Rome, Italie' },
        { id: 'BARCELONA', name: 'Barcelone', country: 'Espagne', type: 'CITY', lookupId: 'BARCELONA', fullName: 'Barcelone, Espagne' },
        { id: 'AMSTERDAM', name: 'Amsterdam', country: 'Pays-Bas', type: 'CITY', lookupId: 'AMSTERDAM', fullName: 'Amsterdam, Pays-Bas' },
        { id: 'NEW_YORK', name: 'New York', country: 'États-Unis', type: 'CITY', lookupId: 'NEW_YORK', fullName: 'New York, États-Unis' },
        { id: 'TOKYO', name: 'Tokyo', country: 'Japon', type: 'CITY', lookupId: 'TOKYO', fullName: 'Tokyo, Japon' },
        { id: 'DUBAI', name: 'Dubaï', country: 'Émirats arabes unis', type: 'CITY', lookupId: 'DUBAI', fullName: 'Dubaï, Émirats arabes unis' },
        { id: 'BANGKOK', name: 'Bangkok', country: 'Thaïlande', type: 'CITY', lookupId: 'BANGKOK', fullName: 'Bangkok, Thaïlande' },
        { id: 'ISTANBUL', name: 'Istanbul', country: 'Turquie', type: 'CITY', lookupId: 'ISTANBUL', fullName: 'Istanbul, Turquie' }
      ].filter(dest => 
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.fullName.toLowerCase().includes(query.toLowerCase())
      )
      
      return NextResponse.json({ destinations: fallbackDestinations })
    }

    const viatorData = await response.json()
    console.log('Destinations Viator reçues:', viatorData.destinations?.length || 0)

    if (!viatorData.destinations || viatorData.destinations.length === 0) {
      return NextResponse.json({ destinations: [] })
    }

    // Transformer et filtrer les données Viator
    const destinations: TransformedDestination[] = viatorData.destinations
      .filter((dest: ViatorDestination) => {
        // Filtrer par la recherche
        const searchLower = query.toLowerCase()
        return dest.name.toLowerCase().includes(searchLower) ||
               dest.country.toLowerCase().includes(searchLower) ||
               `${dest.name}, ${dest.country}`.toLowerCase().includes(searchLower)
      })
      .map((dest: ViatorDestination) => ({
        id: dest.lookupId || dest.ref.toString(),
        name: dest.name,
        country: dest.country,
        type: dest.destinationType,
        lookupId: dest.lookupId,
        fullName: `${dest.name}, ${dest.country}`
      }))
      .slice(0, 10) // Limiter à 10 résultats pour la performance

    console.log(`Retour de ${destinations.length} destinations pour "${query}"`)

    return NextResponse.json({ destinations })

  } catch (error) {
    console.error('Erreur lors de la recherche de destinations:', error)
    
    // En cas d'erreur, retourner des destinations de fallback
    const fallbackDestinations = [
      { id: 'PARIS', name: 'Paris', country: 'France', type: 'CITY', lookupId: 'PARIS', fullName: 'Paris, France' },
      { id: 'LONDON', name: 'Londres', country: 'Royaume-Uni', type: 'CITY', lookupId: 'LONDON', fullName: 'Londres, Royaume-Uni' },
      { id: 'ROME', name: 'Rome', country: 'Italie', type: 'CITY', lookupId: 'ROME', fullName: 'Rome, Italie' },
      { id: 'BARCELONA', name: 'Barcelone', country: 'Espagne', type: 'CITY', lookupId: 'BARCELONA', fullName: 'Barcelone, Espagne' },
      { id: 'AMSTERDAM', name: 'Amsterdam', country: 'Pays-Bas', type: 'CITY', lookupId: 'AMSTERDAM', fullName: 'Amsterdam, Pays-Bas' }
    ]
    
    return NextResponse.json({ destinations: fallbackDestinations })
  }
} 