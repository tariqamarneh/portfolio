import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Send } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/BrandIcons';
import { MESSAGE_MAX_LENGTH } from '@/lib/constants';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    email: string;
    message: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Close modal on Escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

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
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            message: validateField('message', formData.message)
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
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitMessage('Thank you for your message! I\'ll get back to you soon.');
                setFormData({ name: '', email: '', message: '' });
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
        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
        {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            placeholder: 'Tell me about your project…',
            rows: 4
        }
    ];

    const inputBase = `
        w-full px-4 py-3 rounded-xl text-sm
        border transition-colors duration-200
        bg-abyss-950/70 border-abyss-700 text-abyss-100 placeholder:text-abyss-500
        focus:border-lumen-500 focus:outline-none
    `;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-abyss-950/70 flex items-center justify-center z-[200] backdrop-blur-md px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-md p-7 sm:p-8 panel panel-glow"
                        initial={{ opacity: 0, scale: 0.9, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 28, stiffness: 360 } }}
                        exit={{ opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.2 } }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Soft teal glow */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(76,220,202,0.14), transparent 70%)' }}
                        />

                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-4 right-4 p-2 rounded-full text-abyss-400 hover:text-lumen-400 hover:bg-abyss-800 transition-colors"
                        >
                            <X className="w-4 h-4" strokeWidth={2} />
                        </button>

                        <div className="relative mb-7">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-6 h-px bg-lumen-400" />
                                <span className="eyebrow">Say hello</span>
                            </div>
                            <h2 className="font-display text-2xl sm:text-3xl text-abyss-100">
                                Get in <span className="text-lumen">touch.</span>
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="relative space-y-4">
                            {formFields.map(({ name, label, type, placeholder, rows }) => (
                                <div key={name}>
                                    <label
                                        htmlFor={name}
                                        className="flex items-center justify-between mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-abyss-400"
                                    >
                                        <span>{label}</span>
                                        {name === 'message' && (
                                            <span className="text-lumen-400 tabular-nums">
                                                {formData.message.length}/{MESSAGE_MAX_LENGTH}
                                            </span>
                                        )}
                                    </label>
                                    {type === 'textarea' ? (
                                        <textarea
                                            id={name}
                                            name={name}
                                            value={formData[name as keyof typeof formData]}
                                            onChange={handleChange}
                                            required
                                            rows={rows}
                                            maxLength={MESSAGE_MAX_LENGTH}
                                            className={`${inputBase} resize-none ${fieldErrors[name as keyof typeof fieldErrors] ? '!border-red-400/60' : ''}`}
                                            placeholder={placeholder}
                                            aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                                            aria-describedby={`${name}-error`}
                                        />
                                    ) : (
                                        <input
                                            type={type}
                                            id={name}
                                            name={name}
                                            value={formData[name as keyof typeof formData]}
                                            onChange={handleChange}
                                            required
                                            className={`${inputBase} ${fieldErrors[name as keyof typeof fieldErrors] ? '!border-red-400/60' : ''}`}
                                            placeholder={placeholder}
                                            aria-invalid={!!fieldErrors[name as keyof typeof fieldErrors]}
                                            aria-describedby={`${name}-error`}
                                        />
                                    )}
                                    {fieldErrors[name as keyof typeof fieldErrors] && (
                                        <p
                                            id={`${name}-error`}
                                            className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-300"
                                            role="alert"
                                        >
                                            {fieldErrors[name as keyof typeof fieldErrors]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group"
                                aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
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
                        </form>

                        {submitMessage && (
                            <motion.p
                                className="mt-4 p-3 rounded-xl text-sm text-center border border-sage-500/40 bg-sage-500/5 text-sage-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                ✓ {submitMessage}
                            </motion.p>
                        )}

                        {errorMessage && (
                            <motion.p
                                className="mt-4 p-3 rounded-xl text-sm text-center border border-red-400/40 bg-red-400/5 text-red-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                ⚠ {errorMessage}
                            </motion.p>
                        )}

                        <div className="relative mt-6 pt-6 border-t border-abyss-700/60">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-abyss-400 mb-3 text-center">
                                Or find me elsewhere
                            </p>
                            <div className="flex justify-center gap-3">
                                <a
                                    href="https://github.com/tariqamarneh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="p-2.5 rounded-full border border-abyss-700 text-abyss-300 hover:text-lumen-400 hover:border-lumen-500/40 transition-colors"
                                >
                                    <Github className="w-4 h-4" strokeWidth={1.8} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/tariq-naser/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-2.5 rounded-full border border-abyss-700 text-abyss-300 hover:text-lumen-400 hover:border-lumen-500/40 transition-colors"
                                >
                                    <Linkedin className="w-4 h-4" strokeWidth={1.8} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
