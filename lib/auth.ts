import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface UserPayload {
  id: string
  username: string
  email: string
  role: string
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function authenticateUser(request: NextRequest): Promise<UserPayload | null> {
  const token = request.cookies.get('user_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }
  
  // Vérifier que l'utilisateur existe toujours en base
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, username: true, email: true, role: true, isActive: true }
  })
  
  if (!user || !user.isActive) {
    return null
  }
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }
}

export async function authenticateAdmin(request: NextRequest): Promise<UserPayload | null> {
  const user = await authenticateUser(request)
  
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null
  }
  
  return user
}

export function setUserCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('user_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 heures
  })
  return response
}

export function clearUserCookie(response: NextResponse): NextResponse {
  response.cookies.delete('user_token')
  return response
}

export async function createInitialAdmin(): Promise<void> {
  const existingAdmin = await prisma.user.findFirst({
    where: { username: 'admin' }
  })
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123')
    
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@itineria.fr',
        password: hashedPassword,
        role: 'super_admin'
      }
    })
    
    console.log('✅ Admin initial créé: admin / admin123')
  }
} 