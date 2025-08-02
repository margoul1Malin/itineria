import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.itineria.fr'
  const currentDate = new Date()
  const locales = ['fr', 'en', 'de', 'es']

  // Pages principales pour chaque locale
  const mainRoutes = [
    '',
    '/vols',
    '/hotels', 
    '/activites',
    '/vols-et-hotels',
    '/contact',
    '/profil',
    '/login',
    '/register'
  ]

  // Pages légales pour chaque locale
  const legalRoutes = [
    '/legal/cgv',
    '/legal/privacy',
    '/legal/cookies',
    '/legal/terms'
  ]

  // Générer les URLs pour toutes les locales
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Pages principales
  locales.forEach(locale => {
    mainRoutes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: locales.reduce((acc, loc) => ({
            ...acc,
            [loc]: `${baseUrl}/${loc}${route}`
          }), {})
        }
      })
    })
  })

  // Pages légales
  locales.forEach(locale => {
    legalRoutes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: {
          languages: locales.reduce((acc, loc) => ({
            ...acc,
            [loc]: `${baseUrl}/${loc}${route}`
          }), {})
        }
      })
    })
  })

  return sitemapEntries
}
