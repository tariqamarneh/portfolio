'use client'

import React, { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/components/general/GradientBackground'

interface TimelineEvent {
  date: string
  title: string
  description: string
  icon: string
}

const timelineEvents: TimelineEvent[] = [
  {
    date:"2024-10",
    title: "SDE I (L4) at Amazon",
    description: "Working as a Software Development Engineer at Amazon, building and optimizing scalable applications that impact millions of users globally.",
    icon: "/journey_logo/amazon.svg"
  },
  {
    date: "2024-07",
    title: "Software engineer at ProgressSoft",
    description: "Associate at ProgressSoft as Java Software Engineer, working on web application projects using Spring Boot.",
    icon: "/journey_logo/progressoft.svg"
  },
  {
    date: "2024-03",
    title: "Microsoft Certified",
    description: "Achieved the Microsoft Certified: Azure AI fundamentals certification, demonstrating proficiency in AI and machine learning concepts.",
    icon: "/journey_logo/azure-ai-fundamentals.svg"
  },
  {
    date: "2023-09",
    title: "Internship at PwC",
    description: "Interned at PwC as Generative AI Engineer, working on AI projects and developing web applications.",
    icon: "/journey_logo/pwc.svg"
  },
  {
    date: "2022-07",
    title: "Internship at Arab Bank",
    description: "Gained practical experience working with data and analytics, and building machine learning models.",
    icon: "/journey_logo/arabbank.svg"
  },
  {
    date: "2021-05",
    title: "Google Professional Certified",
    description: "Achieved the Google Professional Data Analytics Certificate, mastering the foundations of data analytics, data visualization, and data quality.",
    icon: "https://images.credly.com/size/340x340/images/7abb071f-772a-46fe-a899-5a11699a62dc/GCC_badge_DA_1000x1000.png"
  },
  {
    date: "2019-09",
    title: "University",
    description: "Embarked on a transformative journey in Data Science and Artificial Intelligence at Princess Sumaya University for Technology, culminating in a successful graduation in 2023 with a commendable 3.23 GPA.",
    icon: "/journey_logo/psut.svg"
  },
]

const TimelineEvent: React.FC<{
  event: TimelineEvent
  isActive: boolean
  isLeft: boolean
  index: number
}> = ({
  event, 
  isActive, 
  isLeft,
  index
}) => {
  const { scrollYProgress } = useScroll()
  const { isDark } = useTheme()

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50, -50]
  )

  const containerVariants = {
    offscreen: { 
      opacity: 0,
      x: isLeft ? -50 : 50,
      y: 50
    },
    onscreen: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1.2,
        delay: index * 0.2
      }
    }
  }

  const contentVariants = {
    inactive: {
      scale: 0.98,
      opacity: 0.7,
      filter: "blur(2px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    active: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    inactive: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4
      }
    },
    active: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const glowVariants = {
    inactive: {
      opacity: 0,
      scale: 1
    },
    active: {
      opacity: [0.5, 0.7, 0.5],
      scale: 1.5,
      transition: {
        opacity: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        },
        scale: {
          duration: 0.4
        }
      }
    }
  }

  return (
    <motion.div 
      className={`mb-16 flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
      variants={containerVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ 
        once: false, 
        margin: "-100px",
        amount: 0.2 
      }}
    >
      <motion.div 
        className={`w-1/2 ${isLeft ? 'text-right pr-12' : 'text-left pl-12'}`}
        variants={contentVariants}
        animate={isActive ? "active" : "inactive"}
      >
        <motion.div
          className={`inline-block mb-2 px-3 py-1 rounded-full ${
            isDark
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-blue-100 text-blue-600'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-sm font-semibold">{event.date}</span>
        </motion.div>

        <motion.h3
          className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          whileHover={{ x: isLeft ? -5 : 5 }}
        >
          {event.title}
        </motion.h3>

        <motion.p
          className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}
          style={{ y }}
        >
          {event.description}
        </motion.p>
      </motion.div>

      <div className="relative">
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isDark ? 'bg-blue-500' : 'bg-blue-400'
          }`}
          variants={glowVariants}
          animate={isActive ? "active" : "inactive"}
          style={{ filter: "blur(15px)" }}
        />

        <motion.div
          className={`relative flex items-center justify-center w-16 h-16 rounded-full
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            shadow-lg border-2 ${isActive ? 'border-blue-500' : 'border-gray-400'}
            transition-colors duration-300
          `}
          variants={iconVariants}
          animate={isActive ? "active" : "inactive"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={event.icon}
            width={36}
            height={36}
            alt={`${event.title} logo`}
            className="object-contain"
          />
        </motion.div>
      </div>

      <div className="w-1/2" />
    </motion.div>
  )
}

const InteractiveTimeline: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null)

  const lineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0 
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="relative py-8">
      {/* Animated timeline line */}
      <svg
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 h-full"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M1 0L1 100"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Timeline events */}
      {timelineEvents.map((event, index) => (
        <div 
          key={event.date} 
          className="relative z-10"
          onMouseEnter={() => setActiveEvent(event.date)}
          onMouseLeave={() => setActiveEvent(null)}
        >
          <TimelineEvent 
            event={event} 
            isActive={activeEvent === event.date} 
            isLeft={index % 2 === 0}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}

export default InteractiveTimeline
