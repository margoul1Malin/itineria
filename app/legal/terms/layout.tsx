import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Itineria",
  description: "Conditions d'utilisation - Itineria",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.itineria.fr/legal/terms",
  },   
  openGraph: {
    title: "Conditions d'utilisation - Itineria",
    description: "Conditions d'utilisation - Itineria",
    url: "https://www.itineria.fr/legal/terms",
    siteName: "Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conditions d'utilisation - Itineria",
    description: "Conditions d'utilisation - Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],  
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}