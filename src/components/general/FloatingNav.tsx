'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Journey', href: '#journey' },
  { name: 'Projects', href: '#projects'},
  { name: 'Skills', href: '#skills'},
  { name: 'Contact', href: '#contact' },
]

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setIsVisible(currentScrollPos > 100)

      const sections = navItems.map(item => item.href.slice(1))
      let current = ''

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            current = section
          }
        }
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
    e.preventDefault();
    const element: HTMLElement | null = document.querySelector(href);

    if (element) {
      const offsetTop: number = element.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth' as ScrollBehavior
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="w-auto"
          >
            <nav
              className="glass-effect rounded-full px-3 py-2"
              role="navigation"
              aria-label="Main navigation"
            >
              <ul className="flex items-center justify-center space-x-1 sm:space-x-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <motion.a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.href.slice(1)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-gray-800/50'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                    >
                      <span>{item.name}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>

        </div>
      )}
    </AnimatePresence>
  )
}