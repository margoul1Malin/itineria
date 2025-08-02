import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Itineria",
  description: "Politique de confidentialité - Itineria",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.itineria.fr/legal/privacy",
  },   
  openGraph: {
    title: "Politique de confidentialité - Itineria",
    description: "Politique de confidentialité - Itineria",
    url: "https://www.itineria.fr/legal/privacy",
    siteName: "Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Politique de confidentialité - Itineria",
    description: "Politique de confidentialité - Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],  
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}