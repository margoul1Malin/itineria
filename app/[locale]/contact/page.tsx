"use client"
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Votre message a été envoyé avec succès !'
        });
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          telephone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Une erreur est survenue lors de l\'envoi du message.'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Une erreur de connexion est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Notre équipe d&apos;experts en voyage est là pour vous accompagner dans la création de votre séjour parfait
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Par Téléphone</h3>
              <p className="text-stone-200">+33 1 23 45 67 89</p>
              <p className="text-sm text-stone-300">Lun-Ven: 9h-18h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Par Email</h3>
              <p className="text-stone-200">contact@itineria.fr</p>
              <p className="text-sm text-stone-300">Réponse sous 24h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Notre Adresse</h3>
              <p className="text-stone-200">123 Rue du Voyage</p>
              <p className="text-sm text-stone-300">75001 Paris, France</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de Contact */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Envoyez-nous un message</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe d&apos;experts en voyage est disponible pour répondre à toutes vos questions et vous accompagner dans la planification de votre prochain voyage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">Sujet *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="Réservation et voyages">Réservation et voyages</option>
                    <option value="Informations générales">Informations générales</option>
                    <option value="Support technique">Support technique</option>
                    <option value="Partenariat commercial">Partenariat commercial</option>
                    <option value="Réclamation">Réclamation</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-black"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>
                {/* Message de statut */}
                {submitStatus.type && (
                  <div className={`p-4 rounded-lg ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-800' 
                      : 'bg-red-100 border border-red-400 text-red-800'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 rounded-lg font-semibold transition-colors text-lg ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-green-50 to-stone-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Pourquoi nous contacter ?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Conseils personnalisés pour votre voyage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Devis sur mesure pour votre budget</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Assistance 24h/7j en cas d&apos;urgence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Expertise des destinations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Réservations en dernière minute</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Horaires d&apos;ouverture</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-semibold">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-semibold">10h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-semibold">Fermé</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Urgence voyage :</strong> Disponible 24h/7j au +33 1 23 45 67 89
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Questions Fréquentes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses aux questions les plus courantes sur nos services de voyage.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">Comment réserver un voyage sur Itineria ?</h3>
              <p className="text-gray-700">
                Réserver un voyage sur Itineria est simple et rapide. Vous pouvez utiliser notre moteur de recherche en haut de page pour comparer les prix des vols, hôtels et activités. Une fois votre sélection faite, suivez les étapes de réservation en ligne ou contactez-nous directement pour une assistance personnalisée.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">Quels sont les moyens de paiement acceptés ?</h3>
              <p className="text-gray-700">
                Nous acceptons tous les moyens de paiement courants : cartes bancaires (Visa, Mastercard, American Express), virements bancaires, chèques et paiements en plusieurs fois pour certains voyages. Toutes nos transactions sont sécurisées par les dernières technologies de cryptage.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">Proposez-vous une assurance voyage ?</h3>
              <p className="text-gray-700">
                Oui, nous proposons plusieurs formules d&apos;assurance voyage adaptées à vos besoins. Nos assurances couvrent l&apos;annulation, les frais médicaux, les bagages et les retards. Nos conseillers peuvent vous aider à choisir la formule la plus adaptée à votre destination et à votre budget.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">Que faire en cas d&apos;annulation ou de modification ?</h3>
              <p className="text-gray-700">
                En cas d&apos;annulation ou de modification, contactez-nous immédiatement. Les conditions varient selon les prestataires et les tarifs choisis. Nous vous accompagnerons dans les démarches et vous informerons des frais éventuels. Nous recommandons fortement de souscrire à une assurance annulation pour vous protéger.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">Proposez-vous des voyages sur mesure ?</h3>
              <p className="text-gray-700">
                Absolument ! Nos experts en voyage créent des itinéraires personnalisés selon vos envies, votre budget et vos contraintes. Que ce soit pour un voyage en famille, un séjour romantique ou une aventure solo, nous concevons des voyages uniques qui correspondent parfaitement à vos attentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Informations Légales */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Informations Légales</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Toutes les informations importantes concernant nos conditions de vente et notre politique de confidentialité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-50 to-stone-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Conditions Générales de Vente</h3>
              <p className="text-gray-700 mb-4">
                Nos conditions générales de vente définissent les droits et obligations de chaque partie lors de la réservation d&apos;un voyage. Elles couvrent les modalités de réservation, de paiement, d&apos;annulation et de modification.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Réservation et confirmation</li>
                <li>• Modalités de paiement</li>
                <li>• Conditions d&apos;annulation</li>
                <li>• Responsabilité et garanties</li>
                <li>• Protection des données</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-stone-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Politique de Confidentialité</h3>
              <p className="text-gray-700 mb-4">
                Nous nous engageons à protéger vos données personnelles conformément au RGPD. Vos informations ne sont utilisées que pour traiter vos réservations et améliorer nos services.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Collecte des données</li>
                <li>• Utilisation des informations</li>
                <li>• Partage des données</li>
                <li>• Vos droits</li>
                <li>• Cookies et tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-stone-600">
        <div className="max-w-4xl mx-auto text-center text-white">
               <h2 className="text-4xl font-bold mb-6">Prêt à partir à l&apos;aventure ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous dès maintenant pour planifier votre prochain voyage inoubliable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Appelez-nous maintenant
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-800 transition-colors">
              Demander un devis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
