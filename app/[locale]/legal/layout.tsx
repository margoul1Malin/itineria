
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const legalPages = [
    { href: "/legal/cgv", label: "Conditions Générales de Vente" },
    { href: "/legal/privacy", label: "Politique de Confidentialité" },
    { href: "/legal/cookies", label: "Politique des Cookies" },
    { href: "/legal/terms", label: "Conditions d'Utilisation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-green-50">
      <Header />
      <div className="pt-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-green-600 to-stone-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Informations Légales</h1>
              <p className="text-xl opacity-90">
                Toutes les informations légales concernant Itineria
              </p>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex flex-wrap justify-center gap-4 py-4">
              {legalPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pathname === page.href
                      ? "bg-green-600 text-white font-semibold"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {children}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}