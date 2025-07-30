export default function Cookies() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Politique des Cookies</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p className="mb-4">
            Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies permettent au site de &quot;se souvenir&quot; de vos actions et préférences (identifiant de connexion, langue, taille de caractères et autres paramètres d&apos;affichage) sur une période donnée.
          </p>
          <p>
            Les cookies ne peuvent pas exécuter de code ou contenir des virus. Ils ne peuvent pas accéder aux autres fichiers sur votre ordinateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">2. Pourquoi utilisons-nous des cookies ?</h2>
          <p className="mb-4">Nous utilisons des cookies pour :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Assurer le bon fonctionnement du site</li>
            <li>Mémoriser vos préférences</li>
            <li>Analyser le trafic et améliorer nos services</li>
            <li>Personnaliser votre expérience</li>
            <li>Vous proposer des offres pertinentes</li>
            <li>Sécuriser votre session</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">3. Types de cookies utilisés</h2>
          
          <h3 className="text-lg font-semibold text-green-600 mb-2">3.1 Cookies essentiels</h3>
          <p className="mb-4">
            Ces cookies sont nécessaires au fonctionnement du site. Ils permettent les fonctionnalités de base comme la navigation et l&apos;accès aux zones sécurisées du site.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><strong>Exemples :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Session de connexion</li>
              <li>Panier d&apos;achat</li>
              <li>Préférences de langue</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-green-600 mb-2">3.2 Cookies de performance</h3>
          <p className="mb-4">
            Ces cookies nous permettent de mesurer et d&apos;analyser comment les visiteurs utilisent notre site pour améliorer son fonctionnement.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><strong>Exemples :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Analytics</li>
              <li>Statistiques de navigation</li>
              <li>Mesure des performances</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-green-600 mb-2">3.3 Cookies de fonctionnalité</h3>
          <p className="mb-4">
            Ces cookies permettent au site de mémoriser les choix que vous faites pour vous offrir une expérience plus personnalisée.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><strong>Exemples :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Préférences de recherche</li>
              <li>Destinations favorites</li>
              <li>Paramètres d&apos;affichage</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-green-600 mb-2">3.4 Cookies publicitaires</h3>
          <p className="mb-4">
            Ces cookies sont utilisés pour vous proposer des publicités pertinentes en fonction de vos centres d&apos;intérêt.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Exemples :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Publicités ciblées</li>
              <li>Réseaux publicitaires</li>
              <li>Suivi des conversions</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">4. Cookies tiers</h2>
          <p className="mb-4">
            Nous utilisons également des services tiers qui peuvent placer des cookies sur votre appareil :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google Analytics :</strong> Analyse du trafic et des performances</li>
            <li><strong>Facebook Pixel :</strong> Publicités ciblées et analyse des conversions</li>
            <li><strong>Stripe :</strong> Traitement des paiements</li>
            <li><strong>Hotjar :</strong> Analyse du comportement utilisateur</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">5. Durée de vie des cookies</h2>
          <p className="mb-4">Les cookies ont différentes durées de vie :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
            <li><strong>Cookies persistants :</strong> Conservés jusqu&apos;à leur expiration ou suppression</li>
            <li><strong>Durée maximale :</strong> 13 mois conformément à la réglementation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">6. Gestion des cookies</h2>
          <p className="mb-4">
            Vous pouvez contrôler et/ou supprimer des cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et paramétrer la plupart des navigateurs pour les empêcher d&apos;en enregistrer.
          </p>
          
          <h3 className="text-lg font-semibold text-green-600 mb-2">6.1 Paramètres de votre navigateur</h3>
          <p className="mb-4">Pour désactiver les cookies dans votre navigateur :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
            <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
            <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
            <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
          </ul>

          <h3 className="text-lg font-semibold text-green-600 mb-2">6.2 Notre panneau de gestion</h3>
          <p className="mb-4">
            Vous pouvez également gérer vos préférences de cookies directement sur notre site via notre panneau de gestion des cookies accessible en bas de page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">7. Impact de la désactivation</h2>
          <p className="mb-4">
            Si vous désactivez les cookies, certaines fonctionnalités du site peuvent ne pas fonctionner correctement :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Connexion automatique</li>
            <li>Mémorisation des préférences</li>
            <li>Panier d&apos;achat persistant</li>
            <li>Personnalisation du contenu</li>
            <li>Analytics et améliorations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">8. Cookies et appareils mobiles</h2>
          <p className="mb-4">
            Sur les appareils mobiles, vous pouvez également contrôler les cookies via les paramètres de votre appareil ou de votre application de navigation.
          </p>
          <p>
            Les applications mobiles peuvent également utiliser des technologies similaires aux cookies pour stocker des informations sur votre appareil.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">9. Mise à jour de cette politique</h2>
          <p className="mb-4">
            Cette politique des cookies peut être mise à jour périodiquement pour refléter les changements dans nos pratiques ou pour d&apos;autres raisons opérationnelles, légales ou réglementaires.
          </p>
          <p>
            Nous vous informerons de tout changement significatif par email ou par notification sur notre site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">10. Contact</h2>
          <p className="mb-4">
            Pour toute question concernant notre utilisation des cookies, contactez-nous :
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Email :</strong> privacy@itineria.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Adresse :</strong> 123 Rue du Voyage, 75001 Paris, France</p>
          </div>
        </section>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
