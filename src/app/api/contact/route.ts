import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 500

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim()
}

export async function POST(req: Request) {
  try {
    // Parse and validate input first
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, email, message } = body as Record<string, unknown>

    // Validate types
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Name, email, and message are required and must be strings' },
        { status: 400 }
      )
    }

    // Validate lengths
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = email.trim()
    const sanitizedMessage = sanitizeInput(message)

    if (sanitizedName.length < 2 || sanitizedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be between 2 and ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(sanitizedEmail) || sanitizedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check for CRLF injection in email
    if (/[\r\n]/.test(sanitizedEmail) || /[\r\n]/.test(sanitizedName)) {
      return NextResponse.json(
        { error: 'Invalid characters in input' },
        { status: 400 }
      )
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be between 10 and ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      )
    }

    // Check email service config after validation
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS
    const contactEmail = process.env.CONTACT_EMAIL || emailUser

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 503 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    const mailOptions = {
      from: emailUser,
      to: contactEmail,
      subject: `New contact form submission from ${sanitizedName}`,
      text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMessage: ${sanitizedMessage}`,
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
