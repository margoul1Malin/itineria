import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies - Itineria",
  description: "Cookies - Itineria",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.itineria.fr/legal/cookies",
  },   
  openGraph: {
    title: "Cookies - Itineria",
    description: "Cookies - Itineria",
    url: "https://www.itineria.fr/legal/cookies",
    siteName: "Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookies - Itineria",
    description: "Cookies - Itineria",
    images: [{ url: "https://www.itineria.fr/ItineriaLogo.png" }],  
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
    return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}