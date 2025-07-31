import { NextRequest, NextResponse } from 'next/server'

// Fonction simple pour décoder un JWT (sans vérification de signature pour le middleware)
function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    // Ajouter le padding si nécessaire
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decoded = atob(paddedPayload)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  // Vérifier si la route est protégée (admin)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Récupérer le token depuis le cookie
    const session = request.cookies.get('session')
    
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      // Décoder le token (sans vérification de signature dans le middleware)
      const payload = decodeJwtPayload(session.value)
      
      if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // L'utilisateur a les droits admin, continuer
      return NextResponse.next()
    } catch (error) {
      // Token invalide, rediriger vers l'accueil
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protéger uniquement les routes admin
    '/admin/:path*'
  ],
} 