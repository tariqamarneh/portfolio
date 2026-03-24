'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Define types
interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
}

// Theme context with proper typing
const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => { }
})

// Favicon SVGs
const darkFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="%23111827" rx="128"/><g transform="translate(256,256)"><path d="M-120 -100 h140 v40 h-50 v160 h-40 v-160 h-50 z" fill="%2360A5FA"/><path d="M20 100 l80 -200 h40 l80 200 h-45 l-20 -50 h-70 l-20 50 h-45 z M110 10 l-25 -65 l-25 65 h50 z" fill="%2393C5FD"/></g></svg>`
const lightFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="%23f5f3ee" rx="128"/><g transform="translate(256,256)"><path d="M-120 -100 h140 v40 h-50 v160 h-40 v-160 h-50 z" fill="%230d9488"/><path d="M20 100 l80 -200 h40 l80 200 h-45 l-20 -50 h-70 l-20 50 h-45 z M110 10 l-25 -65 l-25 65 h50 z" fill="%234f46e5"/></g></svg>`

// Performant CSS-based gradient background with scroll color transition
const GradientBackground: React.FC = () => {
  const { isDark } = useContext(ThemeContext)

  useEffect(() => {
    let ticking = false

    const updateGradient = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min(scrollY / maxScroll, 1)

      document.documentElement.style.setProperty('--scroll-progress', scrollProgress.toString())
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateGradient)
        ticking = true
      }
    }

    // Initial update
    updateGradient()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div
        className={`fixed inset-0 -z-10 transition-colors duration-300 ${
          isDark ? 'gradient-bg-dark' : 'gradient-bg-light'
        }`}
        style={{ willChange: 'background' }}
      />
      {/* Noise texture overlay for premium editorial feel */}
      <svg className="fixed inset-0 -z-[9] pointer-events-none w-full h-full opacity-[0.03]" aria-hidden="true">
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </>
  )
}

// Theme Provider Component with persistence + system detection
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  // Load saved theme or detect system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false)
    }
  }, [])

  // Listen for system theme changes when no saved preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Update favicon when theme changes
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = isDark ? darkFavicon : lightFavicon
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// Theme Toggle Button with circular wipe animation
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [wipe, setWipe] = useState<{ x: number; y: number; color: string } | null>(null)

  const handleToggle = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const newBgColor = isDark ? '#faf9f7' : '#050510'
      setWipe({ x, y, color: newBgColor })

      setTimeout(() => toggleTheme(), 400)
      setTimeout(() => setWipe(null), 900)
    }
  }, [isDark, toggleTheme])

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[100]">
        <motion.button
          ref={buttonRef}
          onClick={handleToggle}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/20 transition-colors duration-200"
          whileTap={{ scale: 0.95 }}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Circular wipe overlay */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            className="fixed inset-0 z-[99] pointer-events-none"
            style={{ backgroundColor: wipe.color }}
            initial={{ clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${wipe.x}px ${wipe.y}px)` }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)

export default GradientBackground
