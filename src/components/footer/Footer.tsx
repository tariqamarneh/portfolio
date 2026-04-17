'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const navItems = [
  { name: 'Intro',    href: '#home'         },
  { name: 'Studio',   href: '#workspace'    },
  { name: 'Story',    href: '#story'        },
  { name: 'Work',     href: '#projects'     },
  { name: 'Craft',    href: '#skills'       },
  { name: 'Words',    href: '#testimonials' },
  { name: 'Contact',  href: '#contact'      },
]

const socialLinks = [
  { name: 'GitHub',   href: 'https://github.com/tariqamarneh',     icon: Github   },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/tariq-naser', icon: Linkedin },
]

const Footer: React.FC = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className={`relative border-t mt-12 ${isDark ? 'border-ink-800' : 'border-ink-800/10'}`}>
      {/* Massive signature */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-20 md:pt-28 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 lg:gap-8"
        >
          <h2 className={`font-display leading-[0.9] tracking-tight text-[clamp(3rem,10vw,9rem)] ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}>
            Let&apos;s{' '}
            <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              build.
            </span>
          </h2>
          <a
            href="mailto:tariqs.naser@gmail.com"
            className={`group inline-flex items-center gap-2 px-5 py-3 rounded-full border transition-all
              ${isDark
                ? 'border-ink-700 text-ink-200 hover:border-ember-500 hover:text-ember-400'
                : 'border-ink-800/15 text-ink-800 hover:border-ember-500 hover:text-ember-600'}
            `}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              tariqs.naser@gmail.com
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className={`h-px ${isDark ? 'bg-ink-800' : 'bg-ink-800/10'}`} />
      </div>

      {/* Meta grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse-soft" />
              <span className="eyebrow">Tariq Amarneh · Portfolio</span>
            </div>
            <p className={`text-sm max-w-md leading-relaxed ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
              Software Development Engineer at Amazon. Writing Java by day,
              prototyping with LLMs by night. Based in Amman.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <h4 className="eyebrow-dim mb-4">Sitemap</h4>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    block text-sm transition-colors duration-200
                    ${isDark ? 'text-ink-400 hover:text-ember-400' : 'text-ink-600 hover:text-ember-600'}
                  `}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="col-span-6 md:col-span-4">
            <h4 className="eyebrow-dim mb-4">Elsewhere</h4>
            <div className="space-y-2">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group flex items-center justify-between gap-3 py-2
                      transition-colors duration-200
                      ${isDark ? 'text-ink-300 hover:text-ember-400' : 'text-ink-700 hover:text-ember-600'}
                    `}
                    aria-label={s.name}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className={`border-t ${isDark ? 'border-ink-800' : 'border-ink-800/10'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-ink-500' : 'text-ink-500'}`}>
            © {currentYear} · Tariq Amarneh
          </p>
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-ink-500' : 'text-ink-500'}`}>
            Built with <span className="text-ember-500">warmth</span> in Amman, Jordan
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer