'use client'

import { PortfolioDataProvider } from '@/context/PortfolioDataContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortfolioDataProvider>
      {children}
    </PortfolioDataProvider>
  )
}
