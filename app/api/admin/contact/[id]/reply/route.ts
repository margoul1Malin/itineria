import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateAdmin } from '@/lib/auth'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateAdmin(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { subject, message } = body

    // Validation des champs
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Sujet et message requis' },
        { status: 400 }
      )
    }

    // Récupérer la demande de contact
    const contact = await prisma.contactQuery.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Demande de contact non trouvée' },
        { status: 404 }
      )
    }

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

    // Envoyer l'email de réponse
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: contact.email,
      subject: `Re: ${contact.subject} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">Itineria - Réponse à votre demande</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Bonjour ${contact.name},</h3>
            <p style="margin: 0 0 15px 0; color: #666;">
              Nous avons bien reçu votre demande concernant : <strong>${contact.subject}</strong>
            </p>
            <p style="margin: 0 0 15px 0; color: #666;">
              Voici notre réponse :
            </p>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 8px; font-size: 14px; color: #666;">
            <p style="margin: 0 0 10px 0;"><strong>Votre message original :</strong></p>
            <div style="background: white; padding: 10px; border-radius: 4px; font-style: italic;">
              ${contact.message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Merci de votre confiance,<br>
              L'équipe Itineria
            </p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
              Cet email a été envoyé automatiquement depuis notre système d'administration.
            </p>
          </div>
        </div>
      `
    })

    // Mettre à jour le statut de la demande
    await prisma.contactQuery.update({
      where: { id },
      data: { 
        status: 'processed',
        updatedAt: new Date()
      }
    })

    // Envoyer une copie à l'admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `[COPIE] Réponse envoyée - ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Copie de la réponse envoyée</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Destinataire :</strong> ${contact.name} (${contact.email})</p>
            <p><strong>Sujet original :</strong> ${contact.subject}</p>
            <p><strong>Réponse envoyée par :</strong> ${user.username}</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 8px;">
            <h3>Message envoyé :</h3>
            <div style="background: white; padding: 10px; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Réponse envoyée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error)
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de la réponse' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 