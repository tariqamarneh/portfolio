'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Github, Linkedin } from '@/components/icons/BrandIcons'

const navItems = [
  { name: 'Intro',    href: '#home'         },
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
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t mt-12 border-abyss-800">
      {/* Massive signature */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-20 md:pt-28 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 lg:gap-8"
        >
          <h2 className="font-display leading-[0.95] tracking-tight text-[clamp(3rem,9vw,8rem)] text-abyss-100">
            Let&apos;s{' '}
            <span className="text-lumen">build.</span>
          </h2>
          <a
            href="mailto:tariqs.naser@gmail.com"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border transition-all
              border-abyss-700 text-abyss-200 hover:border-lumen-500/60 hover:text-lumen-400
              hover:shadow-[0_8px_30px_-12px_rgba(76,220,202,0.4)]"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              tariqs.naser@gmail.com
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="h-px bg-abyss-800" />
      </div>

      {/* Meta grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lumen-400 animate-pulse-soft" />
              <span className="eyebrow">Tariq Amarneh · Portfolio</span>
            </div>
            <p className="text-sm max-w-md leading-relaxed font-light text-abyss-300">
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
                  className="block text-sm transition-colors duration-200 text-abyss-400 hover:text-lumen-400"
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
                    className="group flex items-center justify-between gap-3 py-2
                      transition-colors duration-200 text-abyss-300 hover:text-lumen-400"
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
      <div className="border-t border-abyss-800">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
            © {currentYear} · Tariq Amarneh
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
            Signal sent from <span className="text-lumen-400">Amman, Jordan</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
