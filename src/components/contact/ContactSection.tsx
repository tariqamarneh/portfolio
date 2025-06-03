'use client'

import React, { useState } from 'react'
import { Loader2, Mail, MessageSquare, User, Send, Github, Linkedin } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/components/general/GradientBackground'

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    message: ''
  })
  const { isDark } = useTheme()

  const MESSAGE_MAX_LENGTH = 500

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters long' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters long' :
          value.length > MESSAGE_MAX_LENGTH ? `Message must be less than ${MESSAGE_MAX_LENGTH} characters` : ''
      default:
        return ''
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
    if (Object.values(errors).some(error => error)) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setSubmitMessage("Thank you for your message! I'll get back to you soon.")
        setFormState({ name: '', email: '', message: '' })
      } else {
        const data = await response.json()
        setErrorMessage(data.message || 'Something went wrong. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Unable to send message. Please check your connection and try again.')
    }

    setIsSubmitting(false)
  }

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Your name',
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'your.email@example.com',
      icon: <Mail className="w-5 h-5" />
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message here...',
      rows: 4,
      icon: <MessageSquare className="w-5 h-5" />
    }
  ]

  return (
    <section id="contact" className="py-24 relative overflow-hidden" aria-label="Contact section">
      {/* Modern Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4F46E5,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#7C3AED,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className="inline-block"
          >
            <h2 className="text-6xl sm:text-7xl font-bold relative inline-block mb-4">
              <span className={`
                bg-clip-text text-transparent
                ${isDark
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                }
              `}>
                Get in Touch
              </span>
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-6 text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            Have a question or want to work together? Feel free to reach out!
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className={`
              lg:col-span-3 rounded-2xl p-8
              ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
              backdrop-blur-sm border border-gray-200/10
              shadow-[0_0_30px_rgba(0,0,0,0.1)]
            `}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {formFields.map(({ name, label, type, placeholder, rows, icon }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <div className={`
                      absolute left-3 top-3
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      {icon}
                    </div>
                    {type === 'textarea' ? (
                      <div>
                        <textarea
                          id={name}
                          name={name}
                          value={formState[name as keyof typeof formState]}
                          onChange={handleChange}
                          required
                          rows={rows}
                          maxLength={MESSAGE_MAX_LENGTH}
                          className={`
                            w-full pl-12 pr-4 py-2.5 rounded-xl
                            ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                            backdrop-blur-sm border border-gray-200/10
                            ${isDark ? 'text-white' : 'text-gray-900'}
                            placeholder:${isDark ? 'text-gray-500' : 'text-gray-400'}
                            focus:outline-none focus:ring-2 focus:ring-blue-500/40
                            transition-all duration-300
                            ${fieldErrors[name as keyof typeof fieldErrors] ? 'border-red-500' : ''}
                          `}
                          placeholder={placeholder}
                          aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                          aria-describedby={`${name}-error`}
                        />
                        <div className="mt-1 text-sm text-right text-gray-400">
                          {formState.message.length}/{MESSAGE_MAX_LENGTH}
                        </div>
                      </div>
                    ) : (
                      <input
                        type={type}
                        id={name}
                        name={name}
                        value={formState[name as keyof typeof formState]}
                        onChange={handleChange}
                        required
                        className={`
                          w-full pl-12 pr-4 py-2.5 rounded-xl
                          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                          backdrop-blur-sm border border-gray-200/10
                          ${isDark ? 'text-white' : 'text-gray-900'}
                          placeholder:${isDark ? 'text-gray-500' : 'text-gray-400'}
                          focus:outline-none focus:ring-2 focus:ring-blue-500/40
                          transition-all duration-300
                          ${fieldErrors[name as keyof typeof fieldErrors] ? 'border-red-500' : ''}
                        `}
                        placeholder={placeholder}
                        aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                        aria-describedby={`${name}-error`}
                      />
                    )}
                    {fieldErrors[name as keyof typeof fieldErrors] && (
                      <p
                        id={`${name}-error`}
                        className="mt-1 text-sm text-red-400"
                        role="alert"
                      >
                        {fieldErrors[name as keyof typeof fieldErrors]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full px-6 py-3 rounded-xl font-medium
                  bg-gradient-to-r from-blue-500 to-purple-600
                  text-white shadow-lg shadow-blue-500/25
                  hover:shadow-xl hover:shadow-blue-500/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                  flex items-center justify-center gap-2
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </div>

            {submitMessage && (
              <motion.div
                role="alert"
                className="mt-4 p-4 rounded-xl bg-green-500/10 text-green-400 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitMessage}
              </motion.div>
            )}

            {submitError && (
              <motion.div
                role="alert"
                className="mt-4 p-4 rounded-xl bg-red-500/10 text-red-400 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitError}
              </motion.div>
            )}
          </motion.form>

          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Connect Card */}
            <div className={`
              rounded-2xl p-8
              ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
              backdrop-blur-sm border border-gray-200/10
              shadow-[0_0_30px_rgba(0,0,0,0.1)]
            `}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Connect with Me
              </h3>
              <div className="space-y-6">
                <motion.a
                  href="https://github.com/tariqamarneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-4 p-4 rounded-xl
                    ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'}
                    backdrop-blur-sm border border-gray-200/10
                    transition-all duration-300
                    hover:border-blue-500/30
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      GitHub
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Check out my projects
                    </div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/tariq-naser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-4 p-4 rounded-xl
                    ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'}
                    backdrop-blur-sm border border-gray-200/10
                    transition-all duration-300
                    hover:border-blue-500/30
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Linkedin className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      LinkedIn
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Connect professionally
                    </div>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className={`
              rounded-2xl p-8
              ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
              backdrop-blur-sm border border-gray-200/10
              shadow-[0_0_30px_rgba(0,0,0,0.1)]
            `}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Response
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                I typically respond within 24 hours. For urgent matters, consider reaching out via LinkedIn.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
