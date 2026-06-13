'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'

/**
 * DEEP ORBIT is dark-only by design. The theme context survives as a stub so
 * legacy consumers (command palette, pull-to-contact, admin extras) keep
 * working — isDark is always true and toggling is a no-op.
 */

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => { }
})

const favicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="%2304070d" rx="128"/><circle cx="256" cy="256" r="84" fill="%234cdcca"/><circle cx="256" cy="256" r="150" fill="none" stroke="%234cdcca" stroke-opacity="0.35" stroke-width="10"/><circle cx="394" cy="198" r="16" fill="%23a8f2e6"/></svg>`

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = favicon
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => { } }}>
      <div className="min-h-screen text-abyss-100">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

/** Kept as a no-op export so old imports don't break. */
export const ThemeToggle: React.FC = () => null

export const useTheme = (): ThemeContextType => useContext(ThemeContext)

/**
 * The CSS base layer — paints instantly before (and beneath) the WebGL
 * starfield: deep-space gradient, hairline grid, cool film grain.
 */
const GradientBackground: React.FC = () => {
  // Background is fully static (CSS gradient + grain) — no scroll work needed.
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-abyss-graded grid-overlay" />
      {/* Cool film grain — keeps large dark areas from banding */}
      <svg className="hidden md:block fixed inset-0 -z-10 pointer-events-none w-full h-full opacity-[0.05]" aria-hidden="true">
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </>
  )
}

export default GradientBackground
