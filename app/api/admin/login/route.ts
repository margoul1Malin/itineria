import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { 
  authenticateAdmin, 
  comparePassword, 
  generateToken, 
  setUserCookie,
  createInitialAdmin 
} from '@/lib/auth'
import { 
  checkBruteforceAdvanced, 
  recordFailedAttemptAdvanced, 
  recordSuccessfulAttemptAdvanced 
} from '@/lib/advancedBruteforce'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Créer l'admin initial si nécessaire
    await createInitialAdmin()
    
    // Vérifier la protection anti-bruteforce
    const bruteforceCheck = await checkBruteforceAdvanced(request)
    
    if (bruteforceCheck.blocked) {
      return NextResponse.json(
        { 
          error: `Trop de tentatives de connexion. Veuillez réessayer dans ${bruteforceCheck.remainingTime} secondes.` 
        },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { username, password } = body
    
    // Validation des champs
    if (!username || !password) {
      await recordFailedAttemptAdvanced(request)
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      )
    }
    
    // Rechercher l'utilisateur
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim() }
        ],
        isActive: true
      }
    })
    
    if (!user) {
      await recordFailedAttemptAdvanced(request)
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await comparePassword(password, user.password)
    
    if (!isValidPassword) {
      await recordFailedAttemptAdvanced(request)
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }
    
    // Vérifier que l'utilisateur a les droits admin
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      await recordFailedAttemptAdvanced(request)
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }
    
    // Enregistrer la connexion réussie
    await recordSuccessfulAttemptAdvanced(request)
    
    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // Générer le token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })
    
    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
    
    // Définir le cookie
    setUserCookie(response, token)
    
    return response
    
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
} 