'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Heart, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Journey', href: '#journey' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/tariqamarneh',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/tariq-naser',
    icon: Linkedin,
  },
]

const Footer: React.FC = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className={`relative border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding */}
          <div className="md:col-span-2 space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-2xl font-bold ${isDark ? 'gradient-text' : 'gradient-text-light'}`}
            >
              Tariq Amarneh
            </motion.h3>
            <p className={`text-sm max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Software Development Engineer at Amazon, passionate about building scalable
              applications and exploring the frontiers of AI technology.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2.5 rounded-xl transition-all duration-200
                      ${isDark
                        ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }
                    `}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Quick Links
            </h4>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    flex items-center gap-1 text-sm transition-colors duration-200
                    ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  `}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:tariq@example.com"
                className={`
                  inline-flex items-center gap-1 text-sm transition-colors duration-200
                  ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                `}
              >
                tariqamarneh0@gmail.com
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Based in Jordan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`
          mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4
          border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            &copy; {currentYear} Tariq Amarneh. All rights reserved.
          </p>
          <p className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            in Jordan
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
