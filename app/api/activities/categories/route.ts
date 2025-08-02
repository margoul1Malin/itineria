import { NextResponse } from 'next/server'

const VIATOR_API_URL = 'https://api.viator.com/partner/products/tags'
const VIATOR_API_KEY = process.env.VIATOR_API_KEY

interface ViatorCategory {
  id: string
  name: string
  level: number
  subcategories?: ViatorCategory[]
}

interface TransformedCategory {
  id: string
  name: string
  level: number
  subcategories?: TransformedCategory[]
}

export async function GET() {
  try {
    console.log('Récupération des catégories d\'activités')

    // Vérifier que la clé API Viator est configurée
    if (!VIATOR_API_KEY || VIATOR_API_KEY === 'your_viator_api_key_here') {
      console.error('Clé API Viator non configurée!')
      
      // Retourner des catégories de fallback
      const fallbackCategories = [
        { id: 'TOURS', name: 'Visites et tours', level: 1 },
        { id: 'CULTURE', name: 'Culture et histoire', level: 1 },
        { id: 'NATURE', name: 'Nature et plein air', level: 1 },
        { id: 'FOOD', name: 'Gastronomie et vin', level: 1 },
        { id: 'ADVENTURE', name: 'Aventure et sports', level: 1 },
        { id: 'ENTERTAINMENT', name: 'Divertissement', level: 1 },
        { id: 'WATER', name: 'Activités aquatiques', level: 1 },
        { id: 'TRANSPORT', name: 'Transports', level: 1 }
      ]
      
      return NextResponse.json({ categories: fallbackCategories })
    }

    // Appeler l'API Viator pour récupérer les catégories
    const response = await fetch(VIATOR_API_URL, {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY!,
        'Accept': 'application/json;version=2.0'
      }
    })

    console.log('Statut réponse Viator catégories:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erreur API Viator catégories:', response.status, errorData)
      
      // En cas d'erreur, retourner des catégories de fallback
      const fallbackCategories = [
        { id: 'TOURS', name: 'Visites et tours', level: 1 },
        { id: 'CULTURE', name: 'Culture et histoire', level: 1 },
        { id: 'NATURE', name: 'Nature et plein air', level: 1 },
        { id: 'FOOD', name: 'Gastronomie et vin', level: 1 },
        { id: 'ADVENTURE', name: 'Aventure et sports', level: 1 },
        { id: 'ENTERTAINMENT', name: 'Divertissement', level: 1 },
        { id: 'WATER', name: 'Activités aquatiques', level: 1 },
        { id: 'TRANSPORT', name: 'Transports', level: 1 },
        { id: 'MUSEUMS', name: 'Musées et monuments', level: 1 },
        { id: 'SHOPPING', name: 'Shopping', level: 1 }
      ]
      
      return NextResponse.json({ categories: fallbackCategories })
    }

    const viatorData = await response.json()
    console.log('Catégories Viator reçues:', viatorData.categories?.length || 0)

    if (!viatorData.categories || viatorData.categories.length === 0) {
      // Retourner des catégories de fallback si pas de données
      const fallbackCategories = [
        { id: 'TOURS', name: 'Visites et tours', level: 1 },
        { id: 'CULTURE', name: 'Culture et histoire', level: 1 },
        { id: 'NATURE', name: 'Nature et plein air', level: 1 },
        { id: 'FOOD', name: 'Gastronomie et vin', level: 1 },
        { id: 'ADVENTURE', name: 'Aventure et sports', level: 1 },
        { id: 'ENTERTAINMENT', name: 'Divertissement', level: 1 }
      ]
      
      return NextResponse.json({ categories: fallbackCategories })
    }

    // Transformer les données Viator
    const transformCategory = (cat: ViatorCategory): TransformedCategory => ({
      id: cat.id,
      name: cat.name,
      level: cat.level,
      subcategories: cat.subcategories?.map(transformCategory)
    })

    const categories: TransformedCategory[] = viatorData.categories
      .map(transformCategory)
      .filter((cat: TransformedCategory) => cat.level === 1) // Prendre seulement les catégories de niveau 1 pour simplifier
      .slice(0, 20) // Limiter à 20 catégories principales

    console.log(`Retour de ${categories.length} catégories`)

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    
    // En cas d'erreur, retourner des catégories de fallback
    const fallbackCategories = [
      { id: 'TOURS', name: 'Visites et tours', level: 1 },
      { id: 'CULTURE', name: 'Culture et histoire', level: 1 },
      { id: 'NATURE', name: 'Nature et plein air', level: 1 },
      { id: 'FOOD', name: 'Gastronomie et vin', level: 1 },
      { id: 'ADVENTURE', name: 'Aventure et sports', level: 1 },
      { id: 'ENTERTAINMENT', name: 'Divertissement', level: 1 },
      { id: 'WATER', name: 'Activités aquatiques', level: 1 },
      { id: 'TRANSPORT', name: 'Transports', level: 1 },
      { id: 'MUSEUMS', name: 'Musées et monuments', level: 1 },
      { id: 'SHOPPING', name: 'Shopping', level: 1 },
      { id: 'NIGHTLIFE', name: 'Vie nocturne', level: 1 },
      { id: 'WELLNESS', name: 'Bien-être et spa', level: 1 }
    ]
    
    return NextResponse.json({ categories: fallbackCategories })
  }
} 