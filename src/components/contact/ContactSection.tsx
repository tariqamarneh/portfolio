'use client'

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollAnimation from '@/components/general/ScrollAnimation';

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const MESSAGE_MAX_LENGTH = 500;

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters long' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters long' :
          value.length > MESSAGE_MAX_LENGTH ? `Message must be less than ${MESSAGE_MAX_LENGTH} characters` : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submission
    const errors = {
      name: validateField('name', formState.name),
      email: validateField('email', formState.email),
      message: validateField('message', formState.message)
    };

    setFieldErrors(errors);
    if (Object.values(errors).some(error => error)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitMessage("Thank you for your message! I'll get back to you soon.");
        setFormState({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Unable to send message. Please check your connection and try again.');
    }

    setIsSubmitting(false);
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message here...',
      rows: 4
    }
  ];

  return (
    <section id="contact" className="py-20" aria-label="Contact section">
      <div className="container mx-auto px-8 md:px-16">
        <ScrollAnimation>
          <h2 className="text-5xl font-bold mb-16 text-center neon-text">
            Get in Touch
          </h2>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto glass-effect rounded-xl p-8"
            noValidate
          >
            {formFields.map(({ name, label, type, placeholder, rows }) => (
              <div key={name} className="mb-6">
                <label
                  htmlFor={name}
                  className="block mb-2 text-sm font-medium text-indigo-200"
                >
                  {label}
                </label>
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
                      className={`w-full px-3 py-2 text-indigo-200 bg-indigo-900 bg-opacity-50 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        ${fieldErrors[name as keyof typeof fieldErrors] ? 'border-red-500' : ''}`}
                      placeholder={placeholder}
                      aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                      aria-describedby={`${name}-error`}
                    />
                    <div className="mt-1 text-sm text-indigo-300">
                      {formState.message.length}/{MESSAGE_MAX_LENGTH} characters
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
                    className={`w-full px-3 py-2 text-indigo-200 bg-indigo-900 bg-opacity-50 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${fieldErrors[name as keyof typeof fieldErrors] ? 'border-red-500' : ''}`}
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
            ))}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-5 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600
                rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none
                focus:ring-2 focus:ring-indigo-500 disabled:opacity-50
                flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </form>
        </ScrollAnimation>

        {submitMessage && (
          <motion.div
            role="alert"
            className="mt-4 text-center text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {submitMessage}
          </motion.div>
        )}

        {submitError && (
          <motion.div
            role="alert"
            className="mt-4 text-center text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {submitError}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
