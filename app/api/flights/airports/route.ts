import { NextRequest, NextResponse } from 'next/server'

const DUFFEL_API_URL = 'https://api.duffel.com/air/airports'
const DUFFEL_TOKEN = process.env.DUFFEL_TOKEN

interface Airport {
  iataCode: string
  name: string
  city: string
  country: string
}

// Cache global pour tous les aéroports
let allAirportsCache: Airport[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 heures

// Fonction pour récupérer TOUS les aéroports de Duffel avec pagination
async function fetchAllAirports(): Promise<Airport[]> {
  const now = Date.now()
  
  // Vérifier le cache
  if (allAirportsCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`Utilisation du cache (${allAirportsCache.length} aéroports)`)
    return allAirportsCache
  }

  console.log('Récupération de tous les aéroports depuis Duffel...')

  if (!DUFFEL_TOKEN || DUFFEL_TOKEN === 'your_duffel_token_here') {
    console.error('Token Duffel non configuré!')
    return []
  }

  const airports: Airport[] = []
  let hasMore = true
  let cursor = null
  let pageCount = 0
  const MAX_PAGES = 50 // Limite de sécurité
  const seenCursors = new Set<string>() // Détection de cursor en boucle

  try {
    while (hasMore && pageCount < MAX_PAGES) {
      pageCount++
      const url = new URL(DUFFEL_API_URL)
      url.searchParams.set('limit', '200') // Maximum par page
      if (cursor) {
        url.searchParams.set('after', cursor)
      }

      console.log(`Récupération page ${pageCount} avec cursor: ${cursor || 'première page'}`)

      // Vérifier si on a déjà vu ce cursor (boucle infinie)
      if (cursor && seenCursors.has(cursor)) {
        console.log(`Cursor en boucle détecté: ${cursor}, arrêt de la pagination`)
        break
      }
      if (cursor) {
        seenCursors.add(cursor)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DUFFEL_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2'
        }
      })

      if (!response.ok) {
        console.error('Erreur Duffel API:', response.status, response.statusText)
        break
      }

      const data = await response.json()
      
      // Traiter les aéroports de cette page
      const pageAirports = data.data?.map((airport: {
        iata_code?: string;
        name?: string;
        city_name?: string;
        iata_country_code?: string;
      }) => ({
        iataCode: airport.iata_code || '',
        name: airport.name || '',
        city: airport.city_name || '',
        country: airport.iata_country_code || ''
      })).filter((airport: Airport) => 
        airport.iataCode && airport.name && airport.city
      ) || []

      airports.push(...pageAirports)
      console.log(`Page récupérée: ${pageAirports.length} aéroports (total: ${airports.length})`)

      // Vérifier s'il y a plus de pages
      cursor = data.meta?.after
      hasMore = !!cursor

      // Vérifications de sécurité
      if (airports.length > 15000) {
        console.log('Limite de sécurité atteinte (15k aéroports)')
        break
      }
      
      if (pageCount >= MAX_PAGES) {
        console.log(`Limite de pages atteinte (${MAX_PAGES} pages)`)
        break
      }
    }

    // Dédupliquer par code IATA
    const airportsMap = new Map<string, Airport>()
    airports.forEach(airport => {
      if (!airportsMap.has(airport.iataCode)) {
        airportsMap.set(airport.iataCode, airport)
      }
    })

    allAirportsCache = Array.from(airportsMap.values())
    cacheTimestamp = now

    console.log(`Cache mis à jour: ${allAirportsCache.length} aéroports uniques`)
    return allAirportsCache

  } catch (error) {
    console.error('Erreur lors de la récupération des aéroports:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase().trim() || ''

    console.log('Recherche aéroports avec query:', query)
    
    // Vérifier d'abord si le cache est valide
    const now = Date.now()
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 heures
    
    if (allAirportsCache.length === 0 || (now - cacheTimestamp) > CACHE_DURATION) {
      console.log('Cache vide ou expiré, récupération des aéroports...')
      await fetchAllAirports()
    } else {
      console.log(`Utilisation du cache existant: ${allAirportsCache.length} aéroports`)
    }

    if (query.length < 2) {
      return NextResponse.json({ 
        airports: [],
        total: 0
      })
    }

    // Utiliser le cache d'aéroports
    const allAirports = allAirportsCache

    if (allAirports.length === 0) {
      return NextResponse.json({ 
        error: 'Impossible de récupérer les aéroports',
        airports: [],
        total: 0
      }, { status: 500 })
    }

    // Filtrer par la recherche (nom, ville, code IATA, pays)
    const filteredAirports = allAirports.filter((airport: Airport) => 
      airport.name.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query) ||
      airport.iataCode.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query)
    )

    // Grouper par ville pour créer les options "tous les aéroports"
    const cityGroups = new Map<string, Airport[]>()
    
    filteredAirports.forEach(airport => {
      const cityKey = `${airport.city.toLowerCase()}-${airport.country}`
      if (!cityGroups.has(cityKey)) {
        cityGroups.set(cityKey, [])
      }
      cityGroups.get(cityKey)!.push(airport)
    })

    // Construire la liste finale
    const finalResults: Airport[] = []
    
    cityGroups.forEach((cityAirports) => {
      // Trier les aéroports de la ville par nom
      cityAirports.sort((a, b) => a.name.localeCompare(b.name))
      
      // Si la ville a plusieurs aéroports, ajouter l'option "tous les aéroports"
      if (cityAirports.length > 1) {
        const firstAirport = cityAirports[0]
        finalResults.push({
          iataCode: `ALL_${firstAirport.city.toUpperCase().replace(/[^A-Z]/g, '')}`,
          name: `Tous les aéroports de ${firstAirport.city}`,
          city: firstAirport.city,
          country: firstAirport.country
        })
      }
      
      // Ajouter tous les aéroports individuels
      finalResults.push(...cityAirports)
    })

    // Trier par pertinence (villes avec plus d'aéroports en premier)
    finalResults.sort((a, b) => {
      const aIsAll = a.iataCode.startsWith('ALL_')
      const bIsAll = b.iataCode.startsWith('ALL_')
      
      if (aIsAll && !bIsAll) return -1
      if (!aIsAll && bIsAll) return 1
      
      return a.city.localeCompare(b.city)
    })

    // Limiter à 20 résultats
    const limitedResults = finalResults.slice(0, 20)

    console.log(`Trouvé ${limitedResults.length} résultats pour "${query}"`)

    return NextResponse.json({ 
      airports: limitedResults,
      total: limitedResults.length
    })

  } catch (error) {
    console.error('Erreur lors de la recherche d\'aéroports:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      airports: [],
      total: 0
    }, { status: 500 })
  }
} 