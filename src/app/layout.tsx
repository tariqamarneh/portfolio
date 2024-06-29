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