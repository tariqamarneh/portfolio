// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FloatingNav from '@/components/FloatingNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Name - Web Developer & AI Enthusiast',
  description: 'Portfolio of a web developer specializing in Next.js, Python, and Generative AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="relative">
          {children}
          <FloatingNav />
        </div>
      </body>
    </html>
  )
}