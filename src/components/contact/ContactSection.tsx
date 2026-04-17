'use client'

import React, { useState } from 'react'
import { Loader2, Mail, MessageSquare, User, Send, Github, Linkedin, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../general/GradientBackground'
import { MESSAGE_MAX_LENGTH } from '@/lib/constants'

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', message: '' })
  const { isDark } = useTheme()

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email' : ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' :
          value.length > MESSAGE_MAX_LENGTH ? `Must be under ${MESSAGE_MAX_LENGTH} chars` : ''
      default: return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = {
      name: validateField('name', formState.name),
      email: validateField('email', formState.email),
      message: validateField('message', formState.message)
    }
    setFieldErrors(errors)
    if (Object.values(errors).some(error => error)) return

    setIsSubmitting(true)
    setSubmitMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setSubmitMessage("Thanks for reaching out — I'll get back to you soon.")
        setFormState({ name: '', email: '', message: '' })
      } else {
        const data = await response.json()
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Unable to send. Check your connection and try again.')
    }

    setIsSubmitting(false)
  }

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', icon: <User className="w-4 h-4" strokeWidth={1.8} /> },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: <Mail className="w-4 h-4" strokeWidth={1.8} /> },
    { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell me about your project…', rows: 5, icon: <MessageSquare className="w-4 h-4" strokeWidth={1.8} /> },
  ]

  const inputBase = `
    w-full pl-11 pr-4 py-3 rounded-xl text-sm
    border transition-colors duration-200
    ${isDark
      ? 'bg-ink-900/60 border-ink-700 text-ink-100 placeholder:text-ink-500 focus:border-ember-500'
      : 'bg-paper-50/80 border-ink-800/10 text-ink-950 placeholder:text-ink-400 focus:border-ember-500'}
    focus:outline-none
  `

  return (
    <section id="contact" className="section-padding relative" aria-label="Contact section">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid grid-cols-12 gap-6 mb-14"
        >
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-ember-500" />
              <span className="eyebrow">Chapter · 06 / Contact</span>
            </div>
            <h2 className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}>
              Let&apos;s make{' '}
              <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                something.
              </span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end">
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
              Great projects start with a conversation. Drop a note — I read
              every message and usually reply within a day.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form — 7 cols */}
          <motion.form
            onSubmit={handleSubmit}
            className={`
              lg:col-span-7 relative p-6 md:p-8 rounded-3xl
              ${isDark ? 'bg-ink-900/60 border border-ink-700' : 'bg-paper-50/70 border border-ink-800/10'}
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2.5 mb-7 pb-5 border-b border-ink-700/40">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-ember-500 animate-ping opacity-60" />
                <span className="relative rounded-full bg-ember-500 w-2 h-2" />
              </span>
              <span className="eyebrow">Send a message</span>
            </div>

            <div className="space-y-5">
              {formFields.map(({ name, label, type, placeholder, rows, icon }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className={`flex items-center justify-between mb-2 font-mono text-[10px] uppercase tracking-[0.18em] ${isDark ? 'text-ink-400' : 'text-ink-500'}`}
                  >
                    <span>{label}</span>
                    {name === 'message' && (
                      <span className="text-ember-500 tabular-nums">
                        {formState.message.length}/{MESSAGE_MAX_LENGTH}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3.5 ${type === 'textarea' ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} ${isDark ? 'text-ink-400' : 'text-ink-500'}`}>
                      {icon}
                    </div>
                    {type === 'textarea' ? (
                      <textarea
                        id={name}
                        name={name}
                        value={formState[name as keyof typeof formState]}
                        onChange={handleChange}
                        required
                        rows={rows}
                        maxLength={MESSAGE_MAX_LENGTH}
                        className={`${inputBase} resize-none ${fieldErrors[name as keyof typeof fieldErrors] ? '!border-ember-600' : ''}`}
                        placeholder={placeholder}
                        aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                      />
                    ) : (
                      <input
                        type={type}
                        id={name}
                        name={name}
                        value={formState[name as keyof typeof formState]}
                        onChange={handleChange}
                        required
                        className={`${inputBase} ${fieldErrors[name as keyof typeof fieldErrors] ? '!border-ember-600' : ''}`}
                        placeholder={placeholder}
                        aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                      />
                    )}
                    {fieldErrors[name as keyof typeof fieldErrors] && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ember-400" role="alert">
                        {fieldErrors[name as keyof typeof fieldErrors]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" strokeWidth={2} />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>

            {submitMessage && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl text-sm ${isDark ? 'border border-sage-500/40 bg-sage-500/5 text-sage-400' : 'border border-sage-500/40 bg-sage-500/5 text-sage-500'}`}
              >
                ✓ {submitMessage}
              </motion.div>
            )}
            {submitError && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl text-sm border border-ember-600/40 bg-ember-600/5 text-ember-400"
              >
                ⚠ {submitError}
              </motion.div>
            )}
          </motion.form>

          {/* Side panel — 5 cols */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Direct email */}
            <div className={`p-6 md:p-7 rounded-3xl ${isDark ? 'bg-ink-900/60 border border-ink-700' : 'bg-paper-50/70 border border-ink-800/10'}`}>
              <span className="eyebrow-dim mb-2 block">Direct</span>
              <a
                href="mailto:tariqs.naser@gmail.com"
                className={`font-display text-xl md:text-2xl lg:text-3xl leading-tight break-all link-editorial ${isDark ? 'text-ink-100 hover:text-ember-400' : 'text-ink-950 hover:text-ember-600'}`}
                style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}
              >
                tariqs.naser<span className="text-ember-500">@</span>gmail.com
              </a>
              <div className="rule my-5" />
              <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
                <span className="text-ember-500">→</span> I reply within 24 hours. For urgent matters, LinkedIn is faster.
              </p>
            </div>

            {/* Socials */}
            <div className={`p-6 md:p-7 rounded-3xl ${isDark ? 'bg-ink-900/60 border border-ink-700' : 'bg-paper-50/70 border border-ink-800/10'}`}>
              <span className="eyebrow-dim mb-4 block">Elsewhere</span>
              <div className={`divide-y ${isDark ? 'divide-ink-700/60' : 'divide-ink-800/10'}`}>
                <a
                  href="https://github.com/tariqamarneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between py-3 transition-colors ${isDark ? 'text-ink-100 hover:text-ember-400' : 'text-ink-950 hover:text-ember-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4" strokeWidth={1.8} />
                    <span className="font-display text-lg" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}>
                      GitHub
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </a>
                <a
                  href="https://www.linkedin.com/in/tariq-naser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between py-3 transition-colors ${isDark ? 'text-ink-100 hover:text-ember-400' : 'text-ink-950 hover:text-ember-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4" strokeWidth={1.8} />
                    <span className="font-display text-lg" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}>
                      LinkedIn
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </a>
              </div>
            </div>

            {/* Signature pull quote */}
            <div className={`
              relative p-6 md:p-7 rounded-3xl overflow-hidden
              ${isDark ? 'bg-ink-900/60 border border-ember-500/30' : 'bg-paper-50/70 border border-ember-500/30'}
            `}>
              <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,112,67,0.18), transparent 70%)' }}
              />
              <div className="relative">
                <div className="eyebrow mb-3">Signal</div>
                <p className={`font-display italic text-lg md:text-xl leading-snug ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
                  style={{ fontVariationSettings: '"opsz" 72, "SOFT" 100' }}>
                  &ldquo;The best projects start as conversations.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection