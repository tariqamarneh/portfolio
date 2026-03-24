'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, User, Clock, FolderGit2, Code2, MessageSquare, Mail, Download, Github, X, Command } from 'lucide-react'
import { useTheme } from './GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'

interface PaletteItem {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  keywords: string[]
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isDark } = useTheme()
  const { cvUrl } = usePortfolioData()

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }, [])

  const items: PaletteItem[] = useMemo(() => [
    { id: 'home', label: 'Go to Home', icon: <Home className="w-4 h-4" />, action: () => scrollToSection('home'), keywords: ['home', 'top', 'hero'] },
    { id: 'about', label: 'Go to About', icon: <User className="w-4 h-4" />, action: () => scrollToSection('about'), keywords: ['about', 'bio', 'info'] },
    { id: 'journey', label: 'Go to Journey', icon: <Clock className="w-4 h-4" />, action: () => scrollToSection('journey'), keywords: ['journey', 'experience', 'timeline'] },
    { id: 'projects', label: 'Go to Projects', icon: <FolderGit2 className="w-4 h-4" />, action: () => scrollToSection('projects'), keywords: ['projects', 'work', 'portfolio'] },
    { id: 'skills', label: 'Go to Skills', icon: <Code2 className="w-4 h-4" />, action: () => scrollToSection('skills'), keywords: ['skills', 'tech', 'stack'] },
    { id: 'testimonials', label: 'Go to Testimonials', icon: <MessageSquare className="w-4 h-4" />, action: () => scrollToSection('testimonials'), keywords: ['testimonials', 'reviews'] },
    { id: 'contact', label: 'Go to Contact', icon: <Mail className="w-4 h-4" />, action: () => scrollToSection('contact'), keywords: ['contact', 'email', 'message'] },
    { id: 'cv', label: 'Download CV', icon: <Download className="w-4 h-4" />, action: () => { window.open(cvUrl, '_blank'); setIsOpen(false) }, keywords: ['cv', 'resume', 'download'] },
    { id: 'github', label: 'Open GitHub', icon: <Github className="w-4 h-4" />, action: () => { window.open('https://github.com/tariqamarneh', '_blank'); setIsOpen(false) }, keywords: ['github', 'code', 'repo'] },
  ], [scrollToSection, cvUrl])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    )
  }, [items, query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault()
      filtered[selectedIndex].action()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [filtered, selectedIndex])

  return (
    <>
      {/* Hint badge */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-[90]
          px-3 py-2 rounded-lg text-xs font-medium
          hidden md:flex items-center gap-1.5
          ${isDark
            ? 'bg-gray-800/80 text-gray-400 border border-gray-700 hover:text-gray-200 hover:border-gray-500'
            : 'bg-white/80 text-gray-500 border border-gray-200 hover:text-gray-700 hover:border-gray-400'}
          backdrop-blur-sm transition-colors duration-200
        `}
        aria-label="Open command palette"
      >
        <Command className="w-3 h-3" />
        K
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]"
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className={`
                relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl
                ${isDark
                  ? 'bg-gray-900 border border-gray-700'
                  : 'bg-white border border-gray-200'}
              `}
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Search className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or jump to..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className={`
                    flex-1 bg-transparent outline-none text-sm
                    ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                  `}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className={`px-4 py-8 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No results found
                  </p>
                ) : (
                  filtered.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                        ${index === selectedIndex
                          ? isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                          : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className={index === selectedIndex ? (isDark ? 'text-cyan-400' : 'text-cyan-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}>
                        {item.icon}
                      </span>
                      {item.label}
                      {index === selectedIndex && (
                        <span className={`ml-auto text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          Enter
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className={`flex items-center gap-4 px-4 py-2 border-t text-xs ${isDark ? 'border-gray-700 text-gray-600' : 'border-gray-200 text-gray-400'}`}>
                <span className="flex items-center gap-1">
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>Esc</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
