import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Final Touch — Professional End-of-Tenancy Cleaning',
  description: 'Professional, reliable, and agent-approved cleaning. We help tenants, landlords, and homeowners keep properties immaculate.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
