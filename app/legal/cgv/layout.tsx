import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV - Itineria",
  description: "Conditions Générales de Vente - Itineria",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.itineria.fr/legal/cgv",
  },   
  openGraph: {
    title: "CGV - Itineria",
    description: "Conditions Générales de Vente - Itineria",
    url: "https://www.itineria.fr/legal/cgv",
    siteName: "Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGV - Itineria",
    description: "Conditions Générales de Vente - Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],  
  },
};

export default function CGVLayout({ children }: { children: React.ReactNode }) {
    return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}