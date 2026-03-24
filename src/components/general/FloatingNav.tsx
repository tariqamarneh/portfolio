'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Clock, FolderGit2, Code2, MessageSquare, Mail } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Journey', href: '#journey', icon: Clock },
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

  // Use IntersectionObserver for section detection
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.slice(1))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && activeSectionRef.current !== sectionId) {
              activeSectionRef.current = sectionId
              setActiveSection(sectionId)
              // Subtle haptic tap on section change (Android; iOS ignores gracefully)
              navigator.vibrate?.(10)
            }
          })
        },
        { rootMargin: '-33% 0px -66% 0px', threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
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
