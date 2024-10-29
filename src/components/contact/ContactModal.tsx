import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';


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
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields before submission
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
        { name: 'email', label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
        {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            placeholder: 'Your message here...',
            rows: 4
        }
    ];

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.75,
            y: -50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 400
            }
        },
        exit: {
            opacity: 0,
            scale: 0.75,
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 relative"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </motion.button>

                        <motion.h2
                            className="text-2xl font-bold mb-6 text-white"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Get in Touch
                        </motion.h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                                value={formData[name as keyof typeof formData]}
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
                                                {formData.message.length}/{MESSAGE_MAX_LENGTH} characters
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type={type}
                                            id={name}
                                            name={name}
                                            value={formData[name as keyof typeof formData]}
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

                        {errorMessage && (
                            <motion.p
                                className="mt-4 text-center text-red-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {errorMessage}
                            </motion.p>
                        )}

                        <motion.div
                            className="mt-6 pt-6 border-t border-gray-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-gray-300 text-sm mb-4">Or connect with me on:</p>
                            <div className="flex space-x-4 justify-center">
                                <motion.a
                                    href="https://github.com/tariqamarneh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-500 hover:text-white transition-colors duration-300"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </motion.a>
                                <motion.a
                                    href="https://www.linkedin.com/in/tariq-naser/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-500 hover:text-white transition-colors duration-300"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;

