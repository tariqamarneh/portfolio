import type { Metadata, Viewport } from 'next'
import { Syne, Sora, Space_Mono } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import React from "react";

// Geometric display face — cosmic, distinctive, set tight (only 600/700 are used)
const display = Syne({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
  weight: ['600', '700'],
})

// Body — soft geometric sans, calm and readable
const body = Sora({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

// Monospace for meta labels, indices, data (only 400 is used)
const mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-mono',
  weight: ['400'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow user zoom for accessibility; don't cap maximumScale on iOS
  maximumScale: 5,
  minimumScale: 1,
  // Fit under the notch / dynamic island on iOS
  viewportFit: 'cover',
  themeColor: '#04070d',
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
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="relative bg-[#04070d] text-[#e2e9f5] flex flex-col min-h-screen antialiased font-sans selection:bg-[#4cdcca]/30 selection:text-white">
        <SpeedInsights />
        <Analytics />
        <main className="flex-grow relative">
          {children}
        </main>
      </body>
    </html>
  )
}
