'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
]

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const handleScroll = () => {
      toggleVisibility()
      const sections = ['home', 'projects', 'skills', 'journey', 'contact']
      let current = ''

      for (let section of sections) {
        const element = document.getElementById(section)
        if (element && window.scrollY >= element.offsetTop - window.innerHeight / 2) {
          current = section
        }
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-4 px-4 sm:px-0"
        >
          <nav className="glass-effect rounded-full px-4 py-2 w-full max-w-screen-lg">
            <ul className="flex flex-wrap justify-center md:justify-between gap-2 md:gap-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
                      activeSection === item.href.slice(1)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}