// src/components/InteractiveTimeline.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    icon: "/amazon-svgrepo-com.svg"
  },
  {
    date: "2024-07",
    title: "Software engineer at ProgressSoft",
    description: "Associate at ProgressSoft as Java Software Engineer, working on web application projects using Spring Boot.",
    icon: "/progressoft.svg"
  },
  {
    date: "2024-03",
    title: "Microsoft Certified",
    description: "Achieved the Microsoft Certified: Azure AI fundamentals certification, demonstrating proficiency in AI and machine learning concepts.",
    icon: "/azure-ai-fundamentals.svg"
  },
  {
    date: "2023-09",
    title: "Internship at PwC",
    description: "Interned at PwC as Generative AI Engineer, working on AI projects and developing web applications.",
    icon: "/pwc.svg"
  },
  {
    date: "2022-07",
    title: "Internship at Arab Bank",
    description: "Gained practical experience working with data and analytics, and building machine learning models.",
    icon: "/arabbank.svg"
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
    icon: "/psut.svg"
  },
]

const TimelineEvent: React.FC<{ event: TimelineEvent; isActive: boolean; isLeft: boolean }> = ({ event, isActive, isLeft }) => {
  return (
    <motion.div 
      className={`mb-12 flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className="text-sm font-semibold text-indigo-400 mb-1">{event.date}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
        <p className="text-gray-300 text-sm">{event.description}</p>
      </div>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border-4 border-indigo-700 text-2xl z-10">
        <img src={event.icon} width="36" height="36" alt="Logo" />
      </div>
      <div className="w-1/2"></div>
    </motion.div>
  )
}

const InteractiveTimeline: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null)

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
      {timelineEvents.map((event, index) => (
        <div 
          key={event.date} 
          className="relative z-10"
          onMouseEnter={() => setActiveEvent(event.date)}
          onMouseLeave={() => setActiveEvent(null)}
        >
          <TimelineEvent event={event} isActive={activeEvent === event.date} isLeft={index % 2 === 0} />
        </div>
      ))}
    </div>
  )
}

export default InteractiveTimeline
