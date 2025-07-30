"use client"
import { useState } from "react";
import Image from "next/image";

export default function Profil() {
  const [activeTab, setActiveTab] = useState("informations");
  const [isEditing, setIsEditing] = useState(false);

  const user = {
    name: "Marie Dupont",
    email: "marie.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    avatar: "/ItineriaLogo.png",
    memberSince: "2023",
    totalTrips: 12,
    totalReviews: 8,
    favoriteDestinations: ["Paris", "Bali", "Tokyo", "New York"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-stone-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-stone-200 mb-4">Membre depuis {user.memberSince}</p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.totalTrips}</div>
                    <div className="text-sm text-stone-200">Voyages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.totalReviews}</div>
                    <div className="text-sm text-stone-200">Avis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.favoriteDestinations.length}</div>
                    <div className="text-sm text-stone-200">Favoris</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("informations")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "informations"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informations personnelles
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("securite")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "securite"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Sécurité
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("preferences")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "preferences"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Préférences
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "notifications"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 014 6v6m0 0v6a4 4 0 004 4h6a4 4 0 004-4v-6m-4-4V6a4 4 0 00-4-4H8a4 4 0 00-4 4v6m0 0v6a4 4 0 004 4h6a4 4 0 004-4v-6" />
                        </svg>
                        Notifications
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("paiement")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "paiement"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Moyens de paiement
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("confidentialite")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "confidentialite"
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Confidentialité et données
                      </div>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {activeTab === "informations" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Informations personnelles</h2>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          {isEditing ? "Sauvegarder" : "Modifier"}
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                            <input
                              type="text"
                              defaultValue={user.name.split(" ")[0]}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                            <input
                              type="text"
                              defaultValue={user.name.split(" ")[1]}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 text-black"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 text-black"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                          <input
                            type="tel"
                            defaultValue={user.phone}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 text-black"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "securite" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sécurité</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Ancien mot de passe</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                          />
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                          Changer le mot de passe
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "preferences" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Préférences</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Langue</label>
                          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                            <option>Français</option>
                            <option>English</option>
                            <option>Español</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Devise</label>
                          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                            <option>EUR (€)</option>
                            <option>USD ($)</option>
                            <option>GBP (£)</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-700">Notifications par email</div>
                              <div className="text-sm text-gray-500">Recevoir les offres et promotions</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-700">Notifications push</div>
                              <div className="text-sm text-gray-500">Recevoir les alertes en temps réel</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-700">Offres spéciales</div>
                            <div className="text-sm text-gray-500">Recevoir les meilleures offres</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-700">Nouvelles destinations</div>
                            <div className="text-sm text-gray-500">Découvrir de nouveaux lieux</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-700">Rappels de voyage</div>
                            <div className="text-sm text-gray-500">Ne manquez pas vos voyages</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "paiement" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Moyens de paiement</h2>
                      <div className="space-y-6">
                        {/* Cartes enregistrées */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cartes enregistrées</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-700">•••• •••• •••• 1234</div>
                                  <div className="text-sm text-gray-500">Expire 12/25</div>
                                </div>
                              </div>
                              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                Supprimer
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">MC</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-700">•••• •••• •••• 5678</div>
                                  <div className="text-sm text-gray-500">Expire 08/26</div>
                                </div>
                              </div>
                              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Ajouter une nouvelle carte */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ajouter une nouvelle carte</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de carte</label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date d&apos;expiration</label>
                                <input
                                  type="text"
                                  placeholder="MM/AA"
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Code de sécurité</label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du titulaire</label>
                              <input
                                type="text"
                                placeholder="Nom et prénom"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                              />
                            </div>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                              Ajouter la carte
                            </button>
                          </div>
                        </div>

                        {/* Autres moyens de paiement */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Autres moyens de paiement</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">PP</span>
                                </div>
                                <span className="font-medium text-gray-700">PayPal</span>
                              </div>
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                Configurer
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">AP</span>
                                </div>
                                <span className="font-medium text-gray-700">Apple Pay</span>
                              </div>
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                Configurer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "confidentialite" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Confidentialité et gestion des données</h2>
                      <div className="space-y-6">
                        {/* Export des données */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Exporter mes données</h3>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <div className="font-semibold text-blue-800 mb-1">Droit à la portabilité</div>
                                <div className="text-sm text-blue-700">
                                  Vous pouvez télécharger toutes vos données personnelles dans un format lisible par machine.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Données personnelles</div>
                                <div className="text-sm text-gray-500">Informations de profil, préférences, historique</div>
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Télécharger
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Historique des voyages</div>
                                <div className="text-sm text-gray-500">Réservations, avis, favoris</div>
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Télécharger
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Données de paiement</div>
                                <div className="text-sm text-gray-500">Moyens de paiement enregistrés (sécurisé)</div>
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Télécharger
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Suppression du compte */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Supprimer mon compte</h3>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <div>
                                <div className="font-semibold text-red-800 mb-1">Action irréversible</div>
                                <div className="text-sm text-red-700">
                                  La suppression de votre compte entraînera la perte définitive de toutes vos données.
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                            Supprimer mon compte
                          </button>
                        </div>

                        {/* Paramètres de confidentialité */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">Paramètres de confidentialité</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Partage de données avec les partenaires</div>
                                <div className="text-sm text-gray-500">Autoriser le partage pour des offres personnalisées</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Cookies et tracking</div>
                                <div className="text-sm text-gray-500">Autoriser les cookies pour une expérience optimale</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-700">Analytics et statistiques</div>
                                <div className="text-sm text-gray-500">Partager les données d&apos;utilisation anonymisées</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
} 