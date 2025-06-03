'use client'

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
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

interface ThemeColors {
  startColor: [number, number, number]
  endColor: [number, number, number]
  accentColor: [number, number, number]
  textColor: string
  starColor: string
}

interface Star {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
}

interface FloatingParticle {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  opacity: number
}

// Theme context with proper typing
const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => { }
})

// Enhanced Theme colors with dynamic effects
const THEMES: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    startColor: [15, 23, 42], // Darker blue
    endColor: [3, 7, 18],     // Deep space black
    accentColor: [99, 102, 241], // Indigo accent
    textColor: 'text-white',
    starColor: '#ffffff'
  },
  light: {
    startColor: [244, 244, 255], // Light lavender
    endColor: [255, 255, 255],   // Pure white
    accentColor: [59, 130, 246], // Blue accent
    textColor: 'text-gray-900',
    starColor: '#6366f1'
  }
}

// Modified GradientBackground with enhanced effects
const GradientBackground: React.FC = () => {
  const { isDark } = useContext(ThemeContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeParticles()
    }

    const initializeParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.3
      }))
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Enhanced star creation with twinkling effect
    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2
    }))

    const drawGradient = (scrollPosition: number, time: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.min(scrollPosition / maxScroll, 1)

      const theme = isDark ? THEMES.dark : THEMES.light
      const currentColor = theme.startColor.map((start, i) =>
        Math.round(start + (theme.endColor[i] - start) * scrollPercentage)
      )

      // Create multiple gradients for layered effect
      const baseGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      baseGradient.addColorStop(0, `rgb(${currentColor.join(',')})`)
      baseGradient.addColorStop(1, `rgb(${theme.endColor.join(',')})`)

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle accent gradient
      const accentGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      )
      accentGradient.addColorStop(0, `rgba(${theme.accentColor.join(',')}, 0.05)`)
      accentGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = accentGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawStars = (time: number) => {
      ctx.save()
      stars.forEach(star => {
        // Calculate twinkling effect
        star.twinklePhase += star.twinkleSpeed
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2
        const opacity = 0.3 + (twinkle * 0.7)

        // Draw star with gradient
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 2
        )
        gradient.addColorStop(0, `rgba(${isDark ? '255,255,255' : '99,102,241'}, ${opacity})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    }

    const drawParticles = (time: number) => {
      ctx.save()
      particlesRef.current.forEach(particle => {
        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.speed
        particle.y += Math.sin(particle.angle) * particle.speed

        // Wrap particles around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        const theme = isDark ? THEMES.dark : THEMES.light
        gradient.addColorStop(0, `rgba(${theme.accentColor.join(',')}, ${particle.opacity})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    }

    const moveStars = () => {
      stars.forEach(star => {
        star.x += star.vx
        star.y += star.vy

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0
      })
    }

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGradient(window.scrollY, time)
      drawStars(time)
      moveStars()
      drawParticles(time)
      requestAnimationFrame(animate)
    }

    animate(0)

    const handleScroll = () => {
      drawGradient(window.scrollY, performance.now())
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

// Enhanced Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen ${isDark ? THEMES.dark.textColor : THEMES.light.textColor} transition-colors duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// Enhanced Theme Toggle Button
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <motion.button
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative p-3 rounded-xl
          bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
          shadow-lg hover:shadow-xl
          transition-all duration-300
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 360 }}
            exit={{ y: -20, opacity: 0, rotate: -360 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-300" />
            ) : (
              <Moon className="w-6 h-6 text-gray-100" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`
                absolute left-full ml-4 px-3 py-1.5 rounded-lg
                whitespace-nowrap text-sm font-medium
                ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}
                shadow-lg
              `}
            >
              Switch to {isDark ? 'light' : 'dark'} mode
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)

export default GradientBackground
