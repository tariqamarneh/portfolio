"use client"
import React, { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'

type Position = 'top' | 'bottom';

interface ScrollProgressIndicatorProps {
  height?: string;
  color?: string;
  showAfter?: number;
  position?: Position;
  shadow?: boolean;
  gradient?: boolean;
}

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  height = 'h-1',
  color = 'bg-indigo-700',
  showAfter = 100,
  position = 'top',
  shadow = true,
  gradient = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showAfter) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  const positionClasses: Record<Position, string> = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            fixed left-0 right-0 ${height} ${color} 
            ${positionClasses[position]} origin-left z-50
            ${shadow ? 'shadow-md' : ''}
            ${gradient ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
          `}
          style={{ 
            scaleX,
            backgroundSize: '200% 100%',
          }}
        >
          {gradient && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollProgressIndicator