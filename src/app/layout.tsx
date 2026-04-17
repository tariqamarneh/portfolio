import type { Metadata, Viewport } from 'next'
import { Fraunces, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'
import FloatingNav from '../components/general/FloatingNav'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import React from "react";

// Editorial serif with optical sizing + soft axis for distinctive display type
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
  axes: ['opsz', 'SOFT'],
})

// Monospace for meta labels, indices, data
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-mono',
})

// Editorial body font — light and distinctive
const body = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow user zoom for accessibility; don't cap maximumScale on iOS
  maximumScale: 5,
  minimumScale: 1,
  // Fit under the notch / dynamic island on iOS
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf7ef' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0807' },
  ],
}

export const metadata: Metadata = {
  title: 'Tariq Amarneh — Software Development Engineer',
  description: 'Portfolio of Tariq Amarneh — SDE at Amazon. Java, Spring Boot, Python, and applied AI.',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tariq',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-startup-image',
        url: '/splash.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${fraunces.variable} ${mono.variable} ${body.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdnjs.cloudflare.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="relative bg-[#0c0a08] text-[#f5ece0] flex flex-col min-h-screen antialiased font-sans selection:bg-[#ff6b2b]/30 selection:text-white">
        <SpeedInsights />
        <Analytics />
        <main className="flex-grow relative">
          <FloatingNav />
          {children}
        </main>
      </body>
    </html>
  )
}