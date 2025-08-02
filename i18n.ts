import {getRequestConfig} from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({locale}) => {
  let finalLocale = locale;
  
  // Si locale est undefined, essayer de la récupérer depuis les headers
  if (!finalLocale) {
    const headersList = await headers();
    const headerLocale = headersList.get('x-locale');
    finalLocale = headerLocale || 'fr';
  }
  
  // Si on n'arrive toujours pas à avoir une locale valide, utiliser l'URL
  if (!finalLocale || !['fr', 'en', 'de', 'es'].includes(finalLocale)) {
    finalLocale = 'fr';
  }
  
  return {
    messages: (await import(`./messages/${finalLocale}.json`)).default,
    locale: finalLocale
  };
}); 