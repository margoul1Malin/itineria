import { NextRequest, NextResponse } from 'next/server'

const VIATOR_API_URL = 'https://api.viator.com/partner/products/search'
const VIATOR_API_KEY = process.env.VIATOR_API_KEY

interface ActivitySearchRequest {
  destination: string
  startDate?: string
  endDate?: string
  participants: number
  categoryIds?: string[]
  priceMin?: number
  priceMax?: number
  duration?: string
  sortBy?: 'price' | 'rating' | 'duration' | 'popularity'
}

interface ViatorProduct {
  productCode: string
  title: string
  shortDescription: string
  description: string
  supplier: {
    name: string
  }
  locations: Array<{
    ref: number
    name: string
    country: string
    destinationType: string
  }>
  images: Array<{
    variants: Array<{
      url: string
      width: number
      height: number
    }>
  }>
  pricing: {
    summary: {
      fromPrice: number
      fromPriceBeforeDiscount?: number
      currency: string
    }
  }
  reviews: {
    combinedAverageRating: number
    totalReviews: number
  }
  duration: {
    fixedDurationInMinutes?: number
    variableDurationFromMinutes?: number
    variableDurationToMinutes?: number
  }
  tags: Array<{
    tag: string
  }>
  categories: Array<{
    id: string
    name: string
  }>
  bookingDetails: {
    instantConfirmation: boolean
    freeCancellation: boolean
  }
}

interface TransformedActivity {
  id: string
  title: string
  shortDescription: string
  description: string
  supplier: string
  location: {
    name: string
    country: string
  }
  images: string[]
  price: {
    from: number
    originalPrice?: number
    currency: string
    discount?: number
  }
  rating: {
    average: number
    totalReviews: number
  }
  duration: {
    minutes?: number
    minMinutes?: number
    maxMinutes?: number
    display: string
  }
  tags: string[]
  categories: Array<{
    id: string
    name: string
  }>
  features: {
    instantConfirmation: boolean
    freeCancellation: boolean
  }
}

function generateFallbackActivities(destination: string) {
  return [
    {
      productCode: "FALLBACK_001",
      title: `Visite guidée de ${destination}`,
      description: `Découvrez les merveilles de ${destination} avec un guide local expert.`,
      price: {
        amount: 45.00,
        currency: "EUR"
      },
      duration: "3 heures",
      rating: 4.5,
      reviewCount: 128,
      images: ["/placeholder-activity.jpg"],
      category: "Visites culturelles",
      available: true
    },
    {
      productCode: "FALLBACK_002", 
      title: `Dégustation culinaire à ${destination}`,
      description: `Savourez les spécialités locales et découvrez la gastronomie de ${destination}.`,
      price: {
        amount: 65.00,
        currency: "EUR"
      },
      duration: "2.5 heures",
      rating: 4.7,
      reviewCount: 89,
      images: ["/placeholder-food.jpg"],
      category: "Gastronomie",
      available: true
    },
    {
      productCode: "FALLBACK_003",
      title: `Excursion nature autour de ${destination}`,
      description: `Explorez la nature environnante et profitez des paysages magnifiques.`,
      price: {
        amount: 35.00,
        currency: "EUR"
      },
      duration: "4 heures",
      rating: 4.3,
      reviewCount: 156,
      images: ["/placeholder-nature.jpg"],
      category: "Nature et aventure",
      available: true
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body: ActivitySearchRequest = await request.json()
    const { 
      destination, 
      startDate, 
      endDate, 
      participants = 1, 
      categoryIds = [], 
      priceMin, 
      priceMax, 
      duration,
      sortBy = 'popularity'
    } = body

    console.log('Recherche d\'activités reçue:', body)

    if (!destination) {
      return NextResponse.json({ error: 'Destination requise' }, { status: 400 })
    }

    // Vérifier que la clé API Viator est configurée
    if (!VIATOR_API_KEY || VIATOR_API_KEY === 'your_viator_api_key_here') {
      console.error('Clé API Viator non configurée!')
      return NextResponse.json({ 
        error: 'Configuration manquante: Clé API Viator non configurée',
        message: 'Veuillez configurer VIATOR_API_KEY dans votre fichier .env.local'
      }, { status: 500 })
    }

    // Préparer la requête pour Viator
    const viatorRequest = {
      filtering: {
        destination: destination,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(categoryIds.length > 0 && { categoryIds }),
        ...(priceMin && { priceFrom: priceMin }),
        ...(priceMax && { priceTo: priceMax }),
        ...(duration && { duration }),
        paxMix: [
          {
            ageBand: 'ADULT',
            count: participants
          }
        ]
      },
      sorting: {
        sort: sortBy === 'price' ? 'PRICE_FROM_A' : 
              sortBy === 'rating' ? 'REVIEW_AVG_RATING_D' :
              sortBy === 'duration' ? 'DURATION_FROM_A' : 'RECOMMENDED'
      },
      pagination: {
        start: 1,
        count: 50 // Récupérer plus de résultats pour les filtres côté client
      }
    }

    console.log('Requête Viator:', JSON.stringify(viatorRequest, null, 2))

    // Appeler l'API Viator
    const response = await fetch(VIATOR_API_URL, {
      method: 'POST',
      headers: {
        'exp-api-key': VIATOR_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json;version=2.0'
      },
      body: JSON.stringify(viatorRequest)
    })

    console.log('Statut réponse Viator:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erreur API Viator:', response.status, errorData)
      
      // En cas d'erreur API, retourner des activités de fallback réalistes
      console.log('Utilisation des données de fallback pour la recherche d\'activités')
      
      const fallbackActivities = generateFallbackActivities(destination)
      
      const metadata = {
        priceRange: { min: 25, max: 350 },
        durationRange: { min: 60, max: 480 },
        categories: ['Visites culturelles', 'Gastronomie', 'Nature', 'Aventure', 'Histoire'],
        suppliers: ['City Tours', 'Local Experiences', 'Adventure Co', 'Cultural Walks'],
        hasInstantConfirmation: true,
        hasFreeCancellation: true
      }
      
      return NextResponse.json({ 
        activities: fallbackActivities,
        totalResults: fallbackActivities.length,
        metadata,
        searchInfo: {
          destination,
          startDate,
          endDate,
          participants,
          categoryIds,
          priceMin,
          priceMax,
          duration,
          sortBy
        },
        fallback: true,
        message: 'Données temporaires - Le service Viator est temporairement indisponible'
      })
    }

    const viatorData = await response.json()
    console.log('Réponse Viator reçue, nombre d\'activités:', viatorData.products?.length || 0)

    if (!viatorData.products || viatorData.products.length === 0) {
      return NextResponse.json({ 
        activities: [],
        totalResults: 0,
        message: 'Aucune activité trouvée pour ces critères de recherche',
        metadata: {
          priceRange: { min: 0, max: 0 },
          durationRange: { min: 0, max: 0 },
          categories: [],
          suppliers: [],
          hasInstantConfirmation: false,
          hasFreeCancellation: false
        }
      })
    }

    // Transformer les données Viator en format plus simple
    const activities: TransformedActivity[] = viatorData.products.map((product: ViatorProduct) => {
      // Gérer la durée
      let durationDisplay = 'Durée variable'
      let durationMinutes = 0
      let minMinutes, maxMinutes

      if (product.duration.fixedDurationInMinutes) {
        durationMinutes = product.duration.fixedDurationInMinutes
        const hours = Math.floor(durationMinutes / 60)
        const mins = durationMinutes % 60
        durationDisplay = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`
      } else if (product.duration.variableDurationFromMinutes && product.duration.variableDurationToMinutes) {
        minMinutes = product.duration.variableDurationFromMinutes
        maxMinutes = product.duration.variableDurationToMinutes
        durationMinutes = minMinutes // Pour le tri
        
        const fromHours = Math.floor(minMinutes / 60)
        const fromMins = minMinutes % 60
        const toHours = Math.floor(maxMinutes / 60)
        const toMins = maxMinutes % 60
        
        const fromDisplay = fromHours > 0 ? `${fromHours}h${fromMins > 0 ? ` ${fromMins}min` : ''}` : `${fromMins}min`
        const toDisplay = toHours > 0 ? `${toHours}h${toMins > 0 ? ` ${toMins}min` : ''}` : `${toMins}min`
        durationDisplay = `${fromDisplay} - ${toDisplay}`
      }

      // Calculer la réduction si applicable
      const discount = product.pricing.summary.fromPriceBeforeDiscount 
        ? Math.round(((product.pricing.summary.fromPriceBeforeDiscount - product.pricing.summary.fromPrice) / product.pricing.summary.fromPriceBeforeDiscount) * 100)
        : undefined

      return {
        id: product.productCode,
        title: product.title,
        shortDescription: product.shortDescription,
        description: product.description,
        supplier: product.supplier.name,
        location: {
          name: product.locations[0]?.name || '',
          country: product.locations[0]?.country || ''
        },
        images: product.images.map(img => 
          img.variants.find(v => v.width >= 600)?.url || img.variants[0]?.url || ''
        ).filter(Boolean),
        price: {
          from: product.pricing.summary.fromPrice,
          originalPrice: product.pricing.summary.fromPriceBeforeDiscount,
          currency: product.pricing.summary.currency,
          discount
        },
        rating: {
          average: product.reviews.combinedAverageRating,
          totalReviews: product.reviews.totalReviews
        },
        duration: {
          minutes: durationMinutes,
          minMinutes,
          maxMinutes,
          display: durationDisplay
        },
        tags: product.tags.map(tag => tag.tag),
        categories: product.categories,
        features: {
          instantConfirmation: product.bookingDetails.instantConfirmation,
          freeCancellation: product.bookingDetails.freeCancellation
        }
      }
    })

    // Calculer les métadonnées pour les filtres
    const prices = activities.map(a => a.price.from)
    const durations = activities.map(a => a.duration.minutes || 0).filter(d => d > 0)
    const categories = [...new Set(activities.flatMap(a => a.categories.map(c => c.name)))].sort()
    const suppliers = [...new Set(activities.map(a => a.supplier))].sort()

    const metadata = {
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      durationRange: {
        min: durations.length > 0 ? Math.min(...durations) : 0,
        max: durations.length > 0 ? Math.max(...durations) : 0
      },
      categories,
      suppliers,
      hasInstantConfirmation: activities.some(a => a.features.instantConfirmation),
      hasFreeCancellation: activities.some(a => a.features.freeCancellation)
    }

    console.log(`Retour de ${activities.length} activités - Prix de ${metadata.priceRange.min}€ à ${metadata.priceRange.max}€`)
    console.log(`Durées de ${Math.floor(metadata.durationRange.min / 60)}h${metadata.durationRange.min % 60}m à ${Math.floor(metadata.durationRange.max / 60)}h${metadata.durationRange.max % 60}m`)
    console.log(`${categories.length} catégories: ${categories.slice(0, 3).join(', ')}${categories.length > 3 ? '...' : ''}`)

    return NextResponse.json({ 
      activities,
      totalResults: activities.length,
      metadata,
      searchInfo: {
        destination,
        startDate,
        endDate,
        participants,
        categoryIds,
        priceMin,
        priceMax,
        duration,
        sortBy
      }
    })

  } catch (error) {
    console.error('Erreur lors de la recherche d\'activités:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      message: 'Une erreur inattendue s\'est produite lors de la recherche d\'activités'
    }, { status: 500 })
  }
} 