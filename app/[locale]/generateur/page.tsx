"use client"
import { useState } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";

interface Flight {
  id: number;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  duration: string;
  image: string;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: string;
  amenities: string[];
  image: string;
}

interface Activity {
  id: number;
  name: string;
  type: string;
  duration: string;
  price: string;
  description: string;
  image: string;
}

interface GeneratedTrip {
  id: number;
  destination: string;
  description: string;
  flight: Flight;
  hotel: Hotel;
  activities: Activity[];
  totalPrice: string;
}

export default function Generateur() {
  const [keywords, setKeywords] = useState('');
  const [budget, setBudget] = useState('1000');
  const [duration, setDuration] = useState('7');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrips, setGeneratedTrips] = useState<GeneratedTrip[]>([]);
  const [showResults, setShowResults] = useState(false);

  const t = useTranslations('generator');

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    
    setIsGenerating(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      const mockTrips: GeneratedTrip[] = [
        {
          id: 1,
          destination: "Bali, Indonésie",
          description: "Paradis tropical avec plages de sable blanc, temples ancestraux et rizières verdoyantes",
          flight: {
            id: 1,
            airline: "Air France",
            departure: "Paris CDG",
            arrival: "Denpasar",
            departureTime: "08:30",
            arrivalTime: "22:15",
            price: "450€",
            duration: "13h 45min",
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
          },
          hotel: {
            id: 1,
            name: "Villa Paradis Resort",
            location: "Ubud, Bali",
            rating: 4.8,
            price: "120€/nuit",
            amenities: ["Piscine", "Spa", "Restaurant", "Vue rizières"],
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
          },
          activities: [
            {
              id: 1,
              name: "Visite des temples d'Ubud",
              type: "Culture",
              duration: "4h",
              price: "45€",
              description: "Découverte des temples ancestraux et de la culture balinaise",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
            },
            {
              id: 2,
              name: "Balade en rizières",
              type: "Nature",
              duration: "3h",
              price: "35€",
              description: "Randonnée à travers les rizières verdoyantes",
              image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop"
            },
            {
              id: 3,
              name: "Massage traditionnel",
              type: "Bien-être",
              duration: "2h",
              price: "60€",
              description: "Massage balinais traditionnel dans un spa luxueux",
              image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop"
            }
          ],
          totalPrice: "899€"
        },
        {
          id: 2,
          destination: "Santorini, Grèce",
          description: "Île volcanique avec villages blancs perchés sur les falaises et couchers de soleil magiques",
          flight: {
            id: 2,
            airline: "Aegean Airlines",
            departure: "Paris CDG",
            arrival: "Santorini",
            departureTime: "10:15",
            arrivalTime: "15:30",
            price: "320€",
            duration: "5h 15min",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop"
          },
          hotel: {
            id: 2,
            name: "Hôtel Caldera View",
            location: "Oia, Santorini",
            rating: 4.9,
            price: "180€/nuit",
            amenities: ["Vue caldera", "Piscine", "Terrasse privée", "Petit-déjeuner"],
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
          },
          activities: [
            {
              id: 4,
              name: "Coucher de soleil à Oia",
              type: "Spectacle",
              duration: "2h",
              price: "25€",
              description: "Admirez le coucher de soleil le plus célèbre de Grèce",
              image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop"
            },
            {
              id: 5,
              name: "Visite d'Akrotiri",
              type: "Histoire",
              duration: "3h",
              price: "40€",
              description: "Site archéologique de l'ancienne ville minoenne",
              image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=300&fit=crop"
            },
            {
              id: 6,
              name: "Croisière autour de l'île",
              type: "Aventure",
              duration: "6h",
              price: "85€",
              description: "Croisière avec arrêt baignade et déjeuner à bord",
              image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
            }
          ],
          totalPrice: "699€"
        },
        {
          id: 3,
          destination: "Marrakech, Maroc",
          description: "Cité impériale avec médina animée, souks colorés et palais somptueux",
          flight: {
            id: 3,
            airline: "Royal Air Maroc",
            departure: "Paris CDG",
            arrival: "Marrakech",
            departureTime: "14:20",
            arrivalTime: "16:45",
            price: "280€",
            duration: "2h 25min",
            image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=300&fit=crop"
          },
          hotel: {
            id: 3,
            name: "Riad Traditionnel",
            location: "Médina, Marrakech",
            rating: 4.7,
            price: "80€/nuit",
            amenities: ["Patio", "Terrasse", "Hammam", "Cuisine marocaine"],
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
          },
          activities: [
            {
              id: 7,
              name: "Médina de Marrakech",
              type: "Culture",
              duration: "4h",
              price: "30€",
              description: "Exploration guidée de la médina et des souks",
              image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=300&fit=crop"
            },
            {
              id: 8,
              name: "Jardin Majorelle",
              type: "Nature",
              duration: "2h",
              price: "20€",
              description: "Visite du célèbre jardin et musée Yves Saint Laurent",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
            },
            {
              id: 9,
              name: "Cours de cuisine",
              type: "Gastronomie",
              duration: "5h",
              price: "55€",
              description: "Apprenez à cuisiner les plats traditionnels marocains",
              image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
            }
          ],
          totalPrice: "449€"
        }
      ];
      
      setGeneratedTrips(mockTrips);
      setShowResults(true);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-green-600 to-stone-600 text-white px-4 py-6 rounded-lg">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                {t('formTitle')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('fromSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4 md:col-span-2 text-black">
                <label className="block text-lg font-semibold text-green-800 mb-3 ">
                  {t('keywords')}
                </label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={t('keywordsPlaceholder')}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 resize-none text-lg transition-all"
                  rows={4}
                />
              </div>
              
              <div className="space-y-4 text-black">
                <label className="block text-lg font-semibold text-green-800 mb-3">
                  {t('budget')}
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-lg transition-all"
                >
                  <option value="500">500€ - 1000€</option>
                  <option value="1000">1000€ - 2000€</option>
                  <option value="2000">2000€ - 5000€</option>
                  <option value="5000">5000€+</option>
                </select>
              </div>
              
              <div className="space-y-4 text-black">
                <label className="block text-lg font-semibold text-green-800 mb-3">
                  {t('duration')}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-lg transition-all"
                >
                  <option value="3">3 jours</option>
                  <option value="5">5 jours</option>
                  <option value="7">7 jours</option>
                  <option value="10">10 jours</option>
                  <option value="14">14 jours</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !keywords.trim()}
                className="bg-gradient-to-r from-green-600 to-stone-600 hover:from-green-700 hover:to-stone-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-4 mx-auto shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🚀</span>
                    {t('generate')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section avec Arborescence */}
        {showResults && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                {t('resultsTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('resultsDescription')}
              </p>
            </div>

            <div className="space-y-16">
              {generatedTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Header du voyage */}
                  <div className="bg-gradient-to-r from-green-600 to-stone-600 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3">{trip.destination}</h3>
                    <p className="text-white/90 text-lg mb-6">{trip.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{trip.totalPrice}</div>
                      <button className="bg-white text-green-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                        {t('bookNow')}
                      </button>
                    </div>
                  </div>

                  {/* Arborescence du voyage */}
                  <div className="p-8">
                    {/* Vol */}
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 text-xl">✈️</span>
                        </div>
                        <h4 className="text-2xl font-bold text-blue-800">Vol</h4>
                      </div>
                      
                      <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h5 className="text-xl font-bold text-blue-800 mb-2">{trip.flight.airline}</h5>
                            <p className="text-blue-600 text-lg">{trip.flight.departure} → {trip.flight.arrival}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-800">{trip.flight.price}</div>
                            <div className="text-blue-600">{trip.flight.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-blue-600">
                          <span>Départ: {trip.flight.departureTime}</span>
                          <span>Arrivée: {trip.flight.arrivalTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ligne de connexion */}
                    <div className="flex justify-center mb-8">
                      <div className="w-1 h-12 bg-green-300 rounded-full"></div>
                    </div>

                    {/* Hôtel */}
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-green-600 text-xl">🏨</span>
                        </div>
                        <h4 className="text-2xl font-bold text-green-800">Hôtel</h4>
                      </div>
                      
                      <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h5 className="text-xl font-bold text-green-800 mb-2">{trip.hotel.name}</h5>
                            <p className="text-green-600 text-lg">{trip.hotel.location}</p>
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400 text-lg">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < trip.hotel.rating ? "text-yellow-400" : "text-gray-300"}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-green-600 ml-3">({trip.hotel.rating})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-800">{trip.hotel.price}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {trip.hotel.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ligne de connexion */}
                    <div className="flex justify-center mb-8">
                      <div className="w-1 h-12 bg-purple-300 rounded-full"></div>
                    </div>

                    {/* Activités */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-purple-600 text-xl">🎯</span>
                        </div>
                        <h4 className="text-2xl font-bold text-purple-800">Activités</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {trip.activities.map((activity) => (
                          <div key={activity.id} className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                            <div className="relative h-48 mb-4">
                              <Image
                                src={activity.image}
                                alt={activity.name}
                                fill
                                className="object-cover rounded-xl"
                              />
                            </div>
                            <h5 className="text-lg font-bold text-purple-800 mb-2">{activity.name}</h5>
                            <p className="text-purple-600 mb-3 text-sm">{activity.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-purple-600 text-sm">{activity.duration}</span>
                              <span className="font-bold text-purple-800">{activity.price}</span>
                            </div>
                            <div className="flex justify-center">
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                                {activity.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Section (quand pas de résultats) */}
        {!showResults && (
          <div className="space-y-16">
            {/* Comment ça marche */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-green-800 mb-4">
                  {t('howItWorks')}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('howItWorksDescription')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-3">{t('step1Title')}</h3>
                  <p className="text-gray-600">{t('step1Description')}</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-stone-200">
                  <div className="w-16 h-16 bg-stone-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-3">{t('step2Title')}</h3>
                  <p className="text-gray-600">{t('step2Description')}</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-3">{t('step3Title')}</h3>
                  <p className="text-gray-600">{t('step3Description')}</p>
                </div>
              </div>
            </div>

            {/* Notre algorithme */}
            <div className="bg-gradient-to-r from-green-600 to-stone-600 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Notre Algorithme Intelligent</h2>
                <p className="text-xl opacity-90">
                  Découvrez comment notre algorithme analyse vos préférences pour créer des itinéraires parfaits
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white/10 rounded-2xl">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-bold mb-2">Analyse de Données</h3>
                  <p className="text-sm opacity-80">Analyse de millions de voyages pour identifier les meilleures combinaisons</p>
                </div>

                <div className="text-center p-6 bg-white/10 rounded-2xl">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold mb-2">Matching Intelligent</h3>
                  <p className="text-sm opacity-80">Correspondance précise entre vos préférences et les destinations</p>
                </div>

                <div className="text-center p-6 bg-white/10 rounded-2xl">
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-lg font-bold mb-2">Optimisation Budget</h3>
                  <p className="text-sm opacity-80">Répartition optimale du budget entre vol, hôtel et activités</p>
                </div>

                <div className="text-center p-6 bg-white/10 rounded-2xl">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-lg font-bold mb-2">Qualité Garantie</h3>
                  <p className="text-sm opacity-80">Sélection des meilleures options selon les avis et notes</p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-green-800 mb-4">Nos Chiffres</h2>
                <p className="text-lg text-gray-600">
                  Des milliers d&apos;itinéraires générés avec succès
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-600">Itinéraires générés</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600">Taux de satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
                  <div className="text-gray-600">Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">2min</div>
                  <div className="text-gray-600">Temps de génération</div>
                </div>
              </div>
            </div>

            {/* Témoignages */}
            <div className="bg-gradient-to-br from-stone-50 to-green-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-green-800 mb-4">Ce qu&apos;en disent nos utilisateurs</h2>
                <p className="text-lg text-gray-600">
                  Découvrez les expériences de nos voyageurs satisfaits
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Marie Dubois</h4>
                      <p className="text-sm text-gray-600">Paris → Bali</p>
                    </div>
                  </div>
                  <p className="text-gray-700">&quot;L&apos;algorithme a parfaitement compris mes envies. Mon voyage à Bali était exactement ce que j&apos;espérais !&quot;</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">P</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Pierre Martin</h4>
                      <p className="text-sm text-gray-600">Lyon → Santorini</p>
                    </div>
                  </div>
                  <p className="text-gray-700">&quot;En 2 minutes, j&apos;avais 3 itinéraires parfaits. Le rapport qualité-prix était excellent !&quot;</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">S</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Sophie Bernard</h4>
                      <p className="text-sm text-gray-600">Marseille → Marrakech</p>
                    </div>
                  </div>
                  <p className="text-gray-700">&quot;L&apos;algorithme a trouvé des activités que je n&apos;aurais jamais pensé à faire. Génial !&quot;</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 