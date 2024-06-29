'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const AudioEasterEgg: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])
  const correctSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setSequence((prev) => [...prev, event.key].slice(-10))
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (sequence.join('') === correctSequence.join('')) {
      playAudio()
    }
  }, [sequence])

  const playAudio = () => {
    setIsPlaying(true)
    const audio = new Audio('/path-to-your-audio-file.mp3')  // Replace with your audio file path
    audio.play()
    setTimeout(() => setIsPlaying(false), 3000)  // Adjust based on your audio length
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
        Easter Egg Found! 🎉
      </div>
    </motion.div>
  )
}

export default AudioEasterEgg