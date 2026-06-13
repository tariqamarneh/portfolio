'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, FolderGit2, Code2, MessageSquare, Mail, LucideIcon } from 'lucide-react'

type NavItem = { key: string; label: string; icon: LucideIcon }

const navItems: NavItem[] = [
  { key: 'home',         label: 'Intro',   icon: Home          },
  { key: 'story',        label: 'Story',   icon: User          },
  { key: 'projects',     label: 'Work',    icon: FolderGit2    },
  { key: 'skills',       label: 'Craft',   icon: Code2         },
  { key: 'testimonials', label: 'Words',   icon: MessageSquare },
  { key: 'contact',      label: 'Contact', icon: Mail          },
]

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const activeSectionRef = useRef('home')

  // Section detection
  useEffect(() => {
    const sectionIds = navItems.map(item => item.key)
    let rafId: number

    const detect = () => {
      const target = window.innerHeight * 0.4
      let best = ''
      let bestDist = Infinity

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue
        const dist = Math.abs(rect.top - target)
        if (dist < bestDist) { bestDist = dist; best = id }
      }

      if (best && activeSectionRef.current !== best) {
        activeSectionRef.current = best
        setActiveSection(best)
        try { navigator.vibrate?.(8) } catch {}
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

  // Show after scroll
  useEffect(() => {
    let ticking = false
    const handle = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 120)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    e.preventDefault()
    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const activeItem = navItems.find(i => i.key === activeSection) ?? navItems[0]

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center px-3 pointer-events-none"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="pointer-events-auto relative flex items-stretch rounded-full
              border backdrop-blur-xl max-w-full
              border-abyss-600/60 bg-abyss-900/70
              shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Brand mark — hidden on very small screens, visible md+ */}
            <div className="hidden md:flex items-center gap-2 px-4 border-r border-abyss-600/60">
              <span className="w-1.5 h-1.5 rounded-full bg-lumen-400 animate-pulse-soft" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-200">
                T · A
              </span>
            </div>

            {/* Mobile: active label pill (left side) */}
            <div className="flex md:hidden items-center gap-1.5 pl-3 pr-2 border-r min-w-0 border-abyss-600/60">
              <span className="w-1.5 h-1.5 rounded-full bg-lumen-400 animate-pulse-soft shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] truncate text-abyss-200">
                {activeItem.label}
              </span>
            </div>

            {/* Nav items */}
            <ul className="relative flex items-center px-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.key
                return (
                  <li key={item.key} className="relative">
                    <a
                      href={`#${item.key}`}
                      onClick={(e) => handleNavClick(e, item.key)}
                      onMouseEnter={() => setHoverKey(item.key)}
                      onMouseLeave={() => setHoverKey(null)}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        relative z-10 flex items-center justify-center gap-2
                        px-2.5 md:px-4 py-2.5
                        transition-colors duration-200
                        min-w-[40px] md:min-w-0
                        ${isActive
                          ? 'text-abyss-950'
                          : 'text-abyss-300 hover:text-abyss-100'}
                      `}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                      {/* Label hidden on mobile */}
                      <span className="hidden md:inline text-sm font-medium">
                        {item.label}
                      </span>

                      {/* Active pill */}
                      {isActive && (
                        <motion.span
                          layoutId="active-nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-lumen-400
                            shadow-[0_8px_25px_-10px_rgba(76,220,202,0.7)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Hover pill (desktop only) */}
                      {!isActive && hoverKey === item.key && (
                        <motion.span
                          layoutId="hover-nav-pill"
                          className="hidden md:block absolute inset-0 -z-0 rounded-full pointer-events-none bg-abyss-700/60"
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}
