// src/components/InteractiveTimeline.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineEvent {
  date: string
  title: string
  description: string
}

const timelineEvents: TimelineEvent[] = [
  {
    date: "2019",
    title: "University",
    description: "Embarked on a transformative journey in Data Science and Artificial Intelligence at Princess Sumaya University for Technology, culminating in a successful graduation in 2023 with a commendable 3.23 GPA."
  },
  {
    date: "2021",
    title: "Google professional certified",
    description: "Achieved the Google Professional Data Analytics Certificate, mastering the foundations of data analytics, data visualization, and data quality."
  },
  {
    date: "2022",
    title: "Internship at Arab bank.",
    description: "Gained practical experience working with data and analytics, and building machine learning models."
  },
  {
    date: "2023",
    title: "Internship at PwC",
    description: "Interned at PwC, as Generative AI Engineer, working on AI projects and developing web applications."
  },
  {
    date: "2024",
    title: "Micrsoft Certified",
    description: "Achieved the Microsoft Certified: Azure AI fundamentals certification, demonstrating proficiency in AI and machine learning concepts."
  },
  {
    date: "2024",
    title: "PwC associate consultant",
    description: "Joined PwC as an Associate Consultant, working on AI projects and developing a full-stack web applications."
  }
]

const TimelineEvent: React.FC<{ event: TimelineEvent; isActive: boolean; isLeft: boolean }> = ({ event, isActive, isLeft }) => {
    return (
      <motion.div 
        className={`mb-8 flex justify-between items-center w-full ${isActive ? 'text-indigo-400' : 'text-gray-400'}`}
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLeft ? (
          <>
            <motion.div 
              className="order-1 w-5/12 px-1 py-4 text-right"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="mb-3 font-bold text-white text-xl">{event.title}</h3>
              <p className="text-sm leading-snug tracking-wide text-gray-300 text-opacity-100">
                {event.description}
              </p>
            </motion.div>
            <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-14 h-14 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">{event.date}</h1>
            </div>
            <div className="order-1 w-5/12"></div>
          </>
        ) : (
          <>
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-14 h-14 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">{event.date}</h1>
            </div>
            <motion.div 
              className="order-1 w-5/12 px-1 py-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="mb-3 font-bold text-white text-xl">{event.title}</h3>
              <p className="text-sm leading-snug tracking-wide text-gray-300 text-opacity-100">
                {event.description}
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    )
  }
  
  const InteractiveTimeline: React.FC = () => {
    const [activeEvent, setActiveEvent] = useState(timelineEvents[timelineEvents.length - 1].date)
  
    return (
      <div className="relative wrap overflow-hidden p-10 h-full">
        <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{left: '50%'}}></div>
        {timelineEvents.map((event, index) => (
          <div key={event.date} onMouseEnter={() => setActiveEvent(event.date)}>
            <TimelineEvent event={event} isActive={activeEvent === event.date} isLeft={index % 2 === 0} />
          </div>
        ))}
      </div>
    )
  }
  
  export default InteractiveTimeline
  