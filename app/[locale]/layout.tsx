import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const locales = ['fr', 'en', 'de', 'es'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  // Attendre les params comme requis par Next.js 15
  const { locale } = await params;
  
  // Valider que la locale est supportée
  if (!locales.includes(locale as string)) {
    notFound();
  }

  // Récupérer les messages pour la locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 