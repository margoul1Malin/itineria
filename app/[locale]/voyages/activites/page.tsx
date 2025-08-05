"use client"
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";

// Types pour les activités
interface Activity {
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

interface Destination {
  id: string
  name: string
  country: string
  type: string
  lookupId: string
  fullName: string
}

interface Category {
  id: string
  name: string
  level: number
}

interface Metadata {
  priceRange: { min: number; max: number }
  durationRange: { min: number; max: number }
  categories: string[]
  suppliers: string[]
  hasInstantConfirmation: boolean
  hasFreeCancellation: boolean
}

interface SearchForm {
  destination: string
  startDate: string
  endDate: string
  participants: number
  categoryIds: string[]
}

interface Filters {
  priceRange: { min: number; max: number }
  durationRange: { min: number; max: number }
  selectedCategories: string[]
  selectedSuppliers: string[]
  minRating: number
  instantConfirmation: boolean
  freeCancellation: boolean
  sortBy: 'price' | 'rating' | 'duration' | 'popularity'
}

type SortBy = 'popularity' | 'price' | 'rating' | 'duration'

export default function ActivitesPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchForm, setSearchForm] = useState<SearchForm>({
    destination: '',
    startDate: '',
    endDate: '',
    participants: 2,
    categoryIds: []
  })
  const [allActivities, setAllActivities] = useState<Activity[]>([])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // États pour les dropdowns
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  
  // État pour les filtres
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: 0, max: 1000 },
    durationRange: { min: 0, max: 1440 }, // 24h en minutes
    selectedCategories: [],
    selectedSuppliers: [],
    minRating: 0,
    instantConfirmation: false,
    freeCancellation: false,
    sortBy: 'popularity'
  })
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const ACTIVITIES_PER_PAGE = 20

  const heroImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop", 
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop"
  ]

  // Auto-changement des images du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Charger les catégories au démarrage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/activities/categories')
        if (response.ok) {
          const data = await response.json()
          setAvailableCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      }
    }
    loadCategories()
  }, [])

  // Optimisation du filtrage avec useMemo
  const filteredActivities = useMemo(() => {
    if (!allActivities.length) return []

    let filtered = [...allActivities]

    // Filtrage par prix
    filtered = filtered.filter(activity => {
      const price = activity.price.from
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })

    // Filtrage par durée
    filtered = filtered.filter(activity => {
      const duration = activity.duration.minutes || 0
      return duration >= filters.durationRange.min && duration <= filters.durationRange.max
    })

    // Filtrage par catégories
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(activity =>
        activity.categories.some(cat => filters.selectedCategories.includes(cat.id))
      )
    }

    // Filtrage par fournisseurs
    if (filters.selectedSuppliers.length > 0) {
      filtered = filtered.filter(activity =>
        filters.selectedSuppliers.includes(activity.supplier)
      )
    }

    // Filtrage par note minimum
    if (filters.minRating > 0) {
      filtered = filtered.filter(activity => activity.rating.average >= filters.minRating)
    }

    // Filtrage par confirmation instantanée
    if (filters.instantConfirmation) {
      filtered = filtered.filter(activity => activity.features.instantConfirmation)
    }

    // Filtrage par annulation gratuite
    if (filters.freeCancellation) {
      filtered = filtered.filter(activity => activity.features.freeCancellation)
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price.from - b.price.from
        case 'rating':
          return b.rating.average - a.rating.average
        case 'duration':
          return (a.duration.minutes || 0) - (b.duration.minutes || 0)
        default:
          return b.rating.totalReviews - a.rating.totalReviews // Popularité par nombre d'avis
      }
    })

    return filtered
  }, [allActivities, filters])

  // Pagination des résultats filtrés
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ACTIVITIES_PER_PAGE
    const endIndex = startIndex + ACTIVITIES_PER_PAGE
    return filteredActivities.slice(startIndex, endIndex)
  }, [filteredActivities, currentPage])

  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE)

  // Reset de la page quand on change de filtres
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Recherche de destinations avec debounce
  const handleDestinationSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setFilteredDestinations([])
      return
    }

    try {
      const response = await fetch(`/api/activities/destinations?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setFilteredDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de destinations:', error)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchForm.destination) {
      setError('Veuillez sélectionner une destination')
      return
    }

    console.log('Formulaire de recherche:', searchForm)
    setIsLoading(true)
    setError('')
    setAllActivities([])
    setMetadata(null)

    try {
      const requestBody = {
        destination: searchForm.destination,
        startDate: searchForm.startDate || undefined,
        endDate: searchForm.endDate || undefined,
        participants: searchForm.participants,
        categoryIds: searchForm.categoryIds,
        sortBy: filters.sortBy
      }

      console.log('Envoi de la requête:', requestBody)

      const response = await fetch('/api/activities/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Statut de la réponse:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Réponse reçue:', data)
        setAllActivities(data.activities || [])
        setMetadata(data.metadata || null)
        setSearchPerformed(true)
        
        // Initialiser les filtres avec les valeurs metadata
        if (data.metadata) {
          setFilters(prev => ({
            ...prev,
            priceRange: { 
              min: data.metadata.priceRange.min, 
              max: data.metadata.priceRange.max 
            },
            durationRange: {
              min: data.metadata.durationRange.min,
              max: data.metadata.durationRange.max
            }
          }))
        }
      } else {
        const errorData = await response.json()
        console.error('Erreur de l\'API:', errorData)
        
        if (errorData.message) {
          setError(errorData.message)
        } else {
          setError('Erreur lors de la recherche d\'activités. Veuillez réessayer.')
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion. Veuillez vérifier votre connexion internet.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectDestination = (destination: Destination) => {
    setSearchForm(prev => ({ ...prev, destination: destination.lookupId }))
    setShowDestinationDropdown(false)
    setFilteredDestinations([])
  }

  const getDisplayValue = (destinationId: string) => {
    const destination = filteredDestinations.find(d => d.lookupId === destinationId)
    return destination ? destination.fullName : destinationId
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`
  }

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
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-800/30 to-stone-800/30"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 w-full max-w-6xl">
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-white/20 mb-8">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
              <span className="text-green-800">Activités</span>
            </h1>
            <p className="text-lg md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto text-gray-700">
              Découvrez des expériences uniques et des activités inoubliables dans le monde entier
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-semibold text-green-800 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Où voulez-vous explorer ?"
                  value={getDisplayValue(searchForm.destination)}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchForm(prev => ({ ...prev, destination: value }))
                    handleDestinationSearch(value)
                    setShowDestinationDropdown(true)
                  }}
                  onFocus={() => setShowDestinationDropdown(true)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  required
                />
                {showDestinationDropdown && filteredDestinations.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
                    {filteredDestinations.map((destination) => (
                      <div
                        key={destination.id}
                        onClick={() => selectDestination(destination)}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{destination.name}</div>
                        <div className="text-sm text-gray-600">{destination.country}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date de début */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Date de début</label>
                <input 
                  type="date" 
                  value={searchForm.startDate}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Date de fin</label>
                <input 
                  type="date" 
                  value={searchForm.endDate}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Participants</label>
                <select 
                  value={searchForm.participants}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, participants: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                >
                  <option value={1}>1 personne</option>
                  <option value={2}>2 personnes</option>
                  <option value={3}>3 personnes</option>
                  <option value={4}>4 personnes</option>
                  <option value={5}>5 personnes</option>
                  <option value={6}>6 personnes</option>
                  <option value={7}>7 personnes</option>
                  <option value={8}>8 personnes</option>
                  <option value={9}>9+ personnes</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">Type d&apos;activité</label>
                <select 
                  onChange={(e) => {
                    const categoryId = e.target.value
                    if (categoryId && !searchForm.categoryIds.includes(categoryId)) {
                      setSearchForm(prev => ({ 
                        ...prev, 
                        categoryIds: [...prev.categoryIds, categoryId] 
                      }))
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                >
                  <option value="">Toutes les activités</option>
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Bouton rechercher */}
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {isLoading ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>

            {/* Catégories sélectionnées */}
            {searchForm.categoryIds.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchForm.categoryIds.map(categoryId => {
                  const category = availableCategories.find(c => c.id === categoryId)
                  return category ? (
                    <span 
                      key={categoryId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => setSearchForm(prev => ({
                          ...prev,
                          categoryIds: prev.categoryIds.filter(id => id !== categoryId)
                        }))}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Résultats de recherche */}
      {searchPerformed && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* En-tête des résultats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Activités disponibles
                </h2>
                <p className="text-gray-600">
                  {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''} trouvée{filteredActivities.length !== 1 ? 's' : ''}
                  {searchForm.destination && ` à ${getDisplayValue(searchForm.destination)}`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
                {/* Tri */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortBy }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="popularity">Plus populaires</option>
                  <option value="price">Prix croissant</option>
                  <option value="rating">Mieux notées</option>
                  <option value="duration">Durée croissante</option>
                </select>

                {/* Bouton filtres */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Filtres {showFilters ? '−' : '+'}
                </button>
              </div>
            </div>

            {/* Panneau de filtres */}
            {showFilters && metadata && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Filtre prix */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix ({metadata.priceRange.min}€ - {metadata.priceRange.max}€)
                    </label>
                    <div className="space-y-2">
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
                      <div className="text-sm text-gray-600">
                        Jusqu&apos;à {filters.priceRange.max}€
                      </div>
                    </div>
                  </div>

                  {/* Filtre durée */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Durée maximum
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={metadata.durationRange.min}
                        max={metadata.durationRange.max}
                        value={filters.durationRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          durationRange: { ...prev.durationRange, max: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600">
                        Jusqu&apos;à {formatDuration(filters.durationRange.max)}
                      </div>
                    </div>
                  </div>

                  {/* Filtre note */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Note minimum
                    </label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value={0}>Toutes les notes</option>
                      <option value={3}>3+ étoiles</option>
                      <option value={4}>4+ étoiles</option>
                      <option value={4.5}>4.5+ étoiles</option>
                    </select>
                  </div>

                  {/* Filtres fonctionnalités */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fonctionnalités
                    </label>
                    <div className="space-y-2">
                      {metadata.hasInstantConfirmation && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.instantConfirmation}
                            onChange={(e) => setFilters(prev => ({ ...prev, instantConfirmation: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm">Confirmation instantanée</span>
                        </label>
                      )}
                      {metadata.hasFreeCancellation && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.freeCancellation}
                            onChange={(e) => setFilters(prev => ({ ...prev, freeCancellation: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm">Annulation gratuite</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filtres catégories */}
                {metadata.categories.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {metadata.categories.slice(0, 10).map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            const isSelected = filters.selectedCategories.includes(category)
                            setFilters(prev => ({
                              ...prev,
                              selectedCategories: isSelected
                                ? prev.selectedCategories.filter(c => c !== category)
                                : [...prev.selectedCategories, category]
                            }))
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.selectedCategories.includes(category)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Liste des activités */}
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      {/* Image */}
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={activity.images[0] || '/placeholder-activity.jpg'}
                          alt={activity.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {activity.price.discount && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            -{activity.price.discount}%
                          </div>
                        )}
                        {activity.features.freeCancellation && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            Annulation gratuite
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {activity.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {activity.shortDescription}
                        </p>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium ml-1">
                              {activity.rating.average.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({activity.rating.totalReviews} avis)
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {activity.duration.display}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">
                            {activity.location.name}
                          </div>
                          {activity.features.instantConfirmation && (
                            <div className="text-xs text-green-600 font-medium">
                              Confirmation instantanée
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            {activity.price.originalPrice && (
                              <span className="text-sm text-gray-400 line-through mr-2">
                                {activity.price.originalPrice}€
                              </span>
                            )}
                            <span className="text-lg font-bold text-green-600">
                              À partir de {activity.price.from}€
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          par {activity.supplier}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-lg ${
                            currentPage === page
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            ) : searchPerformed && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  Aucune activité trouvée pour vos critères de recherche
                </div>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: { min: 0, max: 1000 },
                      durationRange: { min: 0, max: 1440 },
                      selectedCategories: [],
                      selectedSuppliers: [],
                      minRating: 0,
                      instantConfirmation: false,
                      freeCancellation: false,
                      sortBy: 'popularity'
                    })
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section d'appel à l'action si pas de recherche */}
      {!searchPerformed && (
        <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Prêt à partir à l&apos;aventure ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Découvrez des milliers d&apos;activités uniques dans le monde entier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Commencer ma recherche
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 