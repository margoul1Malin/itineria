export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-stone-200 mb-4">Itineria</h3>
            <p className="text-gray-300">
              Votre partenaire de confiance pour des voyages d'exception
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Europe</li>
              <li>Asie</li>
              <li>Amériques</li>
              <li>Afrique</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Vols</li>
              <li>Hôtels</li>
              <li>Activités</li>
              <li>Assurance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>+33 1 23 45 67 89</li>
              <li>contact@itineria.fr</li>
              <li>123 Rue du Voyage, Paris</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Itineria. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
