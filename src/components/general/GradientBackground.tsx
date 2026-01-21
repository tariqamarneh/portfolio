'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
    <div
      className={`fixed inset-0 -z-10 transition-colors duration-300 ${
        isDark ? 'gradient-bg-dark' : 'gradient-bg-light'
      }`}
      style={{ willChange: 'background' }}
    />
  )
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// Theme Toggle Button
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <motion.button
        onClick={toggleTheme}
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
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)

export default GradientBackground
