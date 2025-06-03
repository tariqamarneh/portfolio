'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Heart, ChevronRight } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const navItems = [
  { name: 'About', href: '#home' },
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
    hoverColor: 'hover:text-[#2ea44f]'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/tariq-naser',
    icon: Linkedin,
    hoverColor: 'hover:text-[#0a66c2]'
  },
]

const Footer: React.FC = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4F46E5,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#7C3AED,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Footer Content */}
      <div className={`
        relative border-t
        ${isDark ? 'border-gray-800' : 'border-gray-200'}
      `}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Branding Section */}
            <div className="space-y-4">
              <motion.h3
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Tariq Amarneh
              </motion.h3>
              <motion.p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Software Development Engineer at Amazon, passionate about building scalable and efficient solutions.
              </motion.p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <motion.h4
                className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Quick Links
              </motion.h4>
              <motion.nav
                className="grid grid-cols-2 gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-1 text-sm
                      ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                      transition-colors duration-200
                    `}
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-3 h-3" />
                    {item.name}
                  </motion.a>
                ))}
              </motion.nav>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <motion.h4
                className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Connect
              </motion.h4>
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        p-2 rounded-xl
                        ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}
                        backdrop-blur-sm border border-gray-200/10
                        ${isDark ? 'text-gray-400' : 'text-gray-600'}
                        ${social.hoverColor}
                        transition-all duration-300
                      `}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            className={`
              mt-12 pt-8 text-center text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
              border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="flex items-center justify-center gap-1">
              Made with
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Heart className="w-4 h-4 text-red-500" />
              </motion.span>
              by Tariq Amarneh
            </p>
            <p className="mt-1">
              &copy; {currentYear} All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
