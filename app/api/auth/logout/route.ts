import { NextResponse } from 'next/server'

// POST - Déconnexion utilisateur
export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Déconnexion réussie',
      redirect: '/'
    })
    
    // Supprimer le cookie de session
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immédiatement
    })

    return response
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 