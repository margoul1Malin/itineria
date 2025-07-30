import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/legal/',
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/legal/',
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/legal/',
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
        ],
      },
    ],
    sitemap: 'https://www.itineria.fr/sitemap.xml',
    host: 'https://www.itineria.fr',
  }
}
