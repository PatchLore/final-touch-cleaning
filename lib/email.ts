// lib/email.ts
// Sends emails via Nodemailer (Gmail or any SMTP)
// For production, swap to Resend.com (free 3000/mo) — much simpler

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Final Touch'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendBookingConfirmation(booking: {
  id: string
  name: string
  email: string
  address: string
  moveOutDate: string
  price: number
  duration: string
  breakdown: string
  assignedName?: string
  extras: string[]
}) {
  if (!process.env.EMAIL_USER) {
    console.log('Email not configured — skipping confirmation email')
    return
  }

  const checklist = [
    'Remove all personal belongings',
    'Defrost freezer 24hrs before clean',
    'Ensure hot water and electricity are on',
    'Leave access instructions as discussed',
    'Be present or arrange key handover',
    'Check inventory list if provided by landlord',
  ]

  await transporter.sendMail({
    from: `"${businessName}" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: `Booking confirmed — ${booking.moveOutDate} · ${booking.address}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto;">

    <!-- Header -->
    <div style="background: #16a34a; border-radius: 12px 12px 0 0; padding: 24px 32px;">
      <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">Booking confirmed ✓</h1>
      <p style="color: #bbf7d0; margin: 4px 0 0; font-size: 14px;">Reference: ${booking.id}</p>
    </div>

    <!-- Body -->
    <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #374151; margin-top: 0;">Hi ${booking.name},</p>
      <p style="color: #374151;">Your end-of-tenancy clean is booked. Here are the details:</p>

      <!-- Details box -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="color: #6b7280; padding: 4px 0; width: 100px;">Address</td><td style="color: #111827; font-weight: 500;">${booking.address}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Date</td><td style="color: #111827; font-weight: 500;">${booking.moveOutDate}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Duration</td><td style="color: #111827; font-weight: 500;">${booking.duration}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Total price</td><td style="color: #111827; font-weight: 500;">£${booking.price}</td></tr>
          ${booking.assignedName ? `<tr><td style="color: #6b7280; padding: 4px 0;">Cleaner</td><td style="color: #111827; font-weight: 500;">${booking.assignedName}</td></tr>` : ''}
        </table>
      </div>

      <!-- What's included -->
      <h3 style="color: #111827; font-size: 15px; margin: 24px 0 12px;">What's included</h3>
      <div style="font-size: 13px; color: #374151; line-height: 1.8; white-space: pre-line;">${booking.breakdown}</div>

      <!-- Pre-clean checklist -->
      <h3 style="color: #111827; font-size: 15px; margin: 24px 0 12px;">Your pre-clean checklist</h3>
      <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Please complete these before our team arrives:</p>
      ${checklist.map(item => `<div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
        <span style="color: #16a34a; font-size: 14px; margin-top: 1px;">☐</span>
        <span style="font-size: 13px; color: #374151;">${item}</span>
      </div>`).join('')}

      <!-- Guarantee badge -->
      <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin: 24px 0; font-size: 13px; color: #92400e;">
        🔒 <strong>Deposit-back guarantee</strong> — if your landlord is unsatisfied, we re-clean for free.
      </div>

      <p style="font-size: 13px; color: #6b7280;">Questions? Reply to this email or call us at ${process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+44 7700 000000'}</p>
      <p style="font-size: 13px; color: #374151;">The ${businessName} team</p>
    </div>

    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 16px;">${businessName} · <a href="${appUrl}" style="color: #9ca3af;">${appUrl}</a></p>
  </div>
</body>
</html>
    `,
  })
}

export async function sendSubcontractorNotification(params: {
  cleanerName: string
  cleanerEmail: string
  bookingId: string
  customerName: string
  address: string
  date: string
  duration: string
  accessNotes: string
  extras: string[]
}) {
  if (!process.env.EMAIL_USER) return

  await transporter.sendMail({
    from: `"${businessName}" <${process.env.EMAIL_USER}>`,
    to: params.cleanerEmail,
    subject: `New job assigned — ${params.date} · ${params.address}`,
    html: `
<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #111827;">Hi ${params.cleanerName}, you have a new job!</h2>
  <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px;">
    <p><strong>Booking:</strong> ${params.bookingId}</p>
    <p><strong>Customer:</strong> ${params.customerName}</p>
    <p><strong>Address:</strong> ${params.address}</p>
    <p><strong>Date:</strong> ${params.date}</p>
    <p><strong>Duration:</strong> ${params.duration}</p>
    ${params.accessNotes ? `<p><strong>Access:</strong> ${params.accessNotes}</p>` : ''}
    ${params.extras.length > 0 ? `<p><strong>Extras:</strong> ${params.extras.join(', ')}</p>` : ''}
  </div>
  <p style="font-size: 13px; color: #6b7280;">Reply to this email to confirm or contact us if you have any issues.</p>
  <p style="font-size: 13px;">— ${businessName} team</p>
</div>
    `,
  })
}
