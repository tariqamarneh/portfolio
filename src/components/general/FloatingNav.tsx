'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Home, User, Clock, FolderGit2, Code2, MessageSquare, Mail } from 'lucide-react'
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

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { isDark } = useTheme()
  const activeSectionRef = useRef('')

  // Use IntersectionObserver for section detection instead of getBoundingClientRect on scroll
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.slice(1))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              activeSectionRef.current = sectionId
              setActiveSection(sectionId)
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

  // Separate lightweight scroll handler only for visibility toggle
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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                <ul className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.href.slice(1)

                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`
                          relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl
                          transition-all duration-200 group
                          ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : isDark
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

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
                    </li>
                  )
                })}
                </ul>
              </div>
            </motion.nav>
          </div>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className={`
              fixed bottom-6 right-6 z-50 p-3 rounded-xl
              ${isDark ? 'glass-card-blur' : 'glass-card-blur-light'}
              hover:scale-110 transition-transform duration-200
            `}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            aria-label="Scroll to top"
          >
            <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
