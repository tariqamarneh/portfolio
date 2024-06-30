// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FloatingNav from '@/components/FloatingNav'
import Footer from '@/components/Footer'  // Make sure this import is correct
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tariq Amarneh - Web Developer & AI Enthusiast',
  description: 'Portfolio of a web developer specializing in Next.js, Python, and Generative AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="application-name" content="My Portfolio"/>
        <meta name="apple-mobile-web-app-title" content="Tariq"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="shortcut icon" type="image/jpeg" href="favicon.jpg" />
        <link rel="apple-touch-icon" href="favicon.jpg"/>

      </head>
      <body className={`${inter.className} bg-gray-900 text-white flex flex-col min-h-screen`}>
        <SpeedInsights/>
        <main className="flex-grow">
          {children}
          <FloatingNav />
        </main>
        <Footer />
      </body>
    </html>
  )
}