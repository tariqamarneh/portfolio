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
  height = 'h-[2px]',
  color = 'bg-lumen-500',
  showAfter = 100,
  position = 'top',
  shadow = false,
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
    let ticking = false

    const toggleVisibility = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > showAfter)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
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
            ${gradient ? 'bg-gradient-to-r from-lumen-600 via-lumen-400 to-lumen-300' : ''}
          `}
          style={{ 
            scaleX,
            backgroundSize: '200% 100%',
          }}
        >
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollProgressIndicator