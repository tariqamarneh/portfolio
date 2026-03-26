'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, FolderGit2, Code2, MessageSquare, Mail } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'My Story', href: '#story', icon: User },
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Skills', href: '#skills', icon: Code2 },
  { name: 'Testimonials', href: '#testimonials', icon: MessageSquare },
  { name: 'Contact', href: '#contact', icon: Mail },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { isDark } = useTheme()
  const activeSectionRef = useRef('')

  // Scroll-based section detection: pick the section whose top is closest to 40% of viewport
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.slice(1))
    let rafId: number

    const detect = () => {
      const target = window.innerHeight * 0.4
      let best = ''
      let bestDist = Infinity

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Section must be at least partially visible
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue
        const dist = Math.abs(rect.top - target)
        if (dist < bestDist) {
          bestDist = dist
          best = id
        }
      }

      if (best && activeSectionRef.current !== best) {
        activeSectionRef.current = best
        setActiveSection(best)
        try { navigator.vibrate?.(10) } catch {}
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(detect)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    detect()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Lightweight scroll handler only for visibility toggle
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 100)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Navigation Bar */}
          <div className="fixed top-6 left-0 right-0 z-50 flex justify-center">
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              role="navigation"
              aria-label="Main navigation"
            >
              <div className={`
                px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-2xl
                ${isDark ? 'glass-card-blur' : 'glass-card-blur-light'}
              `}>
                <motion.ul
                  className="flex items-center gap-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.href.slice(1)

                  return (
                    <motion.li key={item.name} variants={itemVariants}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`
                          relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl
                          transition-colors duration-200 group
                          ${isActive
                            ? 'text-white'
                            : isDark
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Animated sliding indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}

                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />

                        {/* Tooltip */}
                        <span className={`
                          absolute -bottom-8 left-1/2 -translate-x-1/2
                          px-2 py-1 text-xs font-medium rounded-md
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200 pointer-events-none whitespace-nowrap
                          ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-md'}
                        `}>
                          {item.name}
                        </span>
                      </a>
                    </motion.li>
                  )
                })}
                </motion.ul>
              </div>
            </motion.nav>
          </div>

        </>
      )}
    </AnimatePresence>
  )
}
