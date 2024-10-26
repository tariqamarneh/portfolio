'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollAnimationWrapper from '../general/ScrollAnimationWrapper'

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setErrorMessage] = useState('')


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setSubmitMessage('Thank you for your message! I\'ll get back to you soon.')
        setFormState({ name: '', email: '', message: '' })
      } else {
        setErrorMessage('Oops! Something went wrong. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Oops! Something went wrong. Please try again later.')
    }

    setIsSubmitting(false)
  }


  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-8 md:px-16">
        <ScrollAnimationWrapper>
          <motion.h2
            className="text-5xl font-bold mb-16 text-center neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto glass-effect rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-indigo-200">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-indigo-200 bg-indigo-900 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-indigo-200 bg-indigo-900 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-indigo-200">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 text-indigo-200 bg-indigo-900 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your message here..."
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-5 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </ScrollAnimationWrapper>
        {submitMessage && (
          <motion.p
            className="mt-4 text-center text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {submitMessage}
          </motion.p>
        )}
        {submitError && (
          <motion.p
            className="mt-4 text-center text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {submitError}
          </motion.p>
        )}
      </div>
    </section>
  )
}