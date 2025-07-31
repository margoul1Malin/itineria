import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation de la longueur des champs
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Le nom doit contenir entre 2 et 100 caractères' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Le message doit contenir entre 10 et 2000 caractères' },
        { status: 400 }
      )
    }

    // Validation du sujet (doit être une des options du menu déroulant)
    const validSubjects = [
      'Réservation et voyages',
      'Informations générales',
      'Support technique',
      'Partenariat commercial',
      'Réclamation',
      'Suggestion',
      'Autre'
    ]

    if (!validSubjects.includes(subject)) {
      return NextResponse.json(
        { error: 'Sujet invalide' },
        { status: 400 }
      )
    }

    // Création de la demande de contact dans la base de données
    const contactQuery = await prisma.contactQuery.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject,
        message: message.trim(),
        status: 'pending'
      }
    })

    // Configuration du transporteur email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })

    // Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Confirmation de votre demande - Itineria',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">Itineria - Confirmation</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Bonjour ${name},</h3>
            <p style="margin: 0 0 15px 0; color: #666;">
              Nous avons bien reçu votre demande concernant : <strong>${subject}</strong>
            </p>
            <p style="margin: 0 0 15px 0; color: #666;">
              Notre équipe va traiter votre demande dans les plus brefs délais. Vous recevrez une réponse détaillée très prochainement.
            </p>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
              <p style="margin: 0; color: #666;"><strong>Votre message :</strong></p>
              <p style="margin: 10px 0 0 0; color: #666; font-style: italic;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Merci de votre confiance,<br>
              L'équipe Itineria
            </p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
              Numéro de référence : ${contactQuery.id}
            </p>
          </div>
        </div>
      `
    })

    // Email de notification à l'admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL,
      subject: `Nouvelle demande de contact - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Nouvelle demande de contact reçue</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>ID :</strong> ${contactQuery.id}</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Message :</h3>
            <div style="background: white; padding: 10px; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Connectez-vous au panel d'administration pour répondre à cette demande.
            </p>
          </div>
        </div>
      `
    })

    // Log pour le suivi (optionnel)
    console.log(`Nouvelle demande de contact reçue: ${contactQuery.id}`)

    // Réponse de succès
    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        id: contactQuery.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors du traitement de la demande de contact:', error)
    
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Méthode GET pour récupérer les demandes de contact (pour l'admin)
export async function GET(request: NextRequest) {
  try {
    // Vérification d'authentification admin (à implémenter selon vos besoins)
    // const isAdmin = await checkAdminAuth(request)
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Construction du filtre
    const where = status && status !== 'all' ? { status } : {}

    // Récupération des demandes de contact
    const [contactQueries, total] = await Promise.all([
      prisma.contactQuery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          message: true,
          createdAt: true,
          status: true
        }
      }),
      prisma.contactQuery.count({ where })
    ])

    return NextResponse.json({
      contactQueries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de contact:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 