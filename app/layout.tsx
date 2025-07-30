import type { Metadata } from "next";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Itinéria | Vols & Hôtels",
  description: "Itinéria | Vols & Hôtels",
  openGraph: {
    title: "Itinéria | Vols & Hôtels",
    description: "Itinéria | Vols & Hôtels",
    images: [
      {
        url: "/ItineriaLogo.png",
        width: 800,
        height: 600,
        alt: "Itinéria | Vols & Hôtels",
      },
    ],
    type: "website",
    url: "https://www.itineria.fr",
    siteName: "Itinéria",
    locale: "fr_FR",
    countryName: "France",
  },
  twitter: {
    card: "summary_large_image",
    title: "Itinéria | Vols & Hôtels",
    description: "Itinéria | Vols & Hôtels",
    images: "/ItineriaLogo.png",
  },
  alternates: {
    canonical: "https://www.itineria.fr",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />  
        {children}
        <Footer />
      </body>
    </html>
  );
}
