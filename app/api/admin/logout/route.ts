import { NextResponse } from 'next/server'
import { clearUserCookie } from '@/lib/auth'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    })
    
    // Supprimer le cookie d'authentification
    clearUserCookie(response)
    
    return response
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    )
  }
} 