import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Générer un code 2FA à 6 chiffres
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Envoyer le code 2FA par email
export async function sendTwoFactorEmail(email: string, code: string, username: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: '🔐 Code d\'authentification 2FA - Itineria',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #ffd93d;">🔐 AUTHENTIFICATION 2FA</h1>
          <p style="margin: 10px 0; font-size: 18px; opacity: 0.9;">Code de vérification</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #ffd93d;">Bonjour ${username},</h2>
          <p style="margin: 0 0 15px 0; color: white;">
            Vous avez demandé l'activation de l'authentification à 2 facteurs pour votre compte Itineria.
          </p>
          <p style="margin: 0 0 15px 0; color: white;">
            Voici votre code de vérification :
          </p>
          
          <div style="background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffd93d; letter-spacing: 8px;">${code}</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">Code à 6 chiffres</p>
          </div>
          
          <p style="margin: 15px 0 0 0; color: white; font-size: 14px;">
            ⚠️ Ce code expire dans 10 minutes pour des raisons de sécurité.
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #ffd93d;">🛡️ Sécurité</h3>
          <ul style="margin: 0; padding-left: 20px; color: white;">
            <li style="margin-bottom: 8px;">Ne partagez jamais ce code avec qui que ce soit</li>
            <li style="margin-bottom: 8px;">Itineria ne vous demandera jamais ce code par email</li>
            <li style="margin-bottom: 8px;">Si vous n'avez pas demandé ce code, ignorez cet email</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">
            Cet email a été envoyé automatiquement par le système de sécurité d'Itineria.
          </p>
        </div>
      </div>
    `
  })
}

// Vérifier le code 2FA
export function verifyTwoFactorCode(inputCode: string, storedCode: string): boolean {
  return inputCode === storedCode
}

// Générer un secret 2FA pour TOTP (Time-based One-Time Password)
export function generateTwoFactorSecret(): string {
  return crypto.randomBytes(20).toString('hex')
} 