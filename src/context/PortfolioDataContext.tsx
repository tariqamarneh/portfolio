'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/components/projects/ProjectsSection'

export interface Skill {
  id: string
  name: string
  level: 'Expert' | 'Intermediate' | 'Beginner'
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai'
  icon: string
  description: string
  yearStarted: number
  isPrimary: boolean
}

export interface LearningItem {
  id: string
  name: string
  description: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  linkedinUrl?: string
}

export interface JourneyEvent {
  id: string
  date: string
  title: string
  description: string
  icon: string
}

interface PortfolioDataContextType {
  projects: Project[]
  skills: Skill[]
  learningItems: LearningItem[]
  testimonials: Testimonial[]
  journeyEvents: JourneyEvent[]
  cvUrl: string
  isLoading: boolean
  addProject: (project: Omit<Project, 'id'>) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  addLearningItem: (item: Omit<LearningItem, 'id'>) => Promise<void>
  deleteLearningItem: (id: string) => Promise<void>
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>
  deleteTestimonial: (id: string) => Promise<void>
  addJourneyEvent: (event: Omit<JourneyEvent, 'id'>) => Promise<void>
  updateJourneyEvent: (id: string, event: Partial<JourneyEvent>) => Promise<void>
  deleteJourneyEvent: (id: string) => Promise<void>
  setCvUrl: (url: string) => Promise<void>
  refreshData: () => Promise<void>
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined)

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [learningItems, setLearningItems] = useState<LearningItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [journeyEvents, setJourneyEvents] = useState<JourneyEvent[]>([])
  const [cvUrl, setCvUrlState] = useState<string>('/Tariq_Naser.pdf')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all data from Supabase
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [
        projectsRes,
        skillsRes,
        learningRes,
        testimonialsRes,
        journeyRes,
        settingsRes
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('created_at', { ascending: true }),
        supabase.from('learning_items').select('*').order('created_at', { ascending: true }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: true }),
        supabase.from('journey_events').select('*').order('date', { ascending: false }),
        supabase.from('settings').select('*').eq('key', 'cv_url').single()
      ])

      if (projectsRes.data) {
        setProjects(projectsRes.data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: p.technologies || [],
          imageUrl: p.image_url,
          linkUrl: p.link_url,
          date: p.date,
          isFeatured: p.is_featured
        })))
      }

      if (skillsRes.data) {
        setSkills(skillsRes.data.map(s => ({
          id: s.id,
          name: s.name,
          level: s.level,
          category: s.category,
          icon: s.icon,
          description: s.description,
          yearStarted: s.year_started,
          isPrimary: s.is_primary
        })))
      }

      if (learningRes.data) {
        setLearningItems(learningRes.data.map(l => ({
          id: l.id,
          name: l.name,
          description: l.description
        })))
      }

      if (testimonialsRes.data) {
        setTestimonials(testimonialsRes.data.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          content: t.content,
          linkedinUrl: t.linkedin_url
        })))
      }

      if (journeyRes.data) {
        setJourneyEvents(journeyRes.data.map(j => ({
          id: j.id,
          date: j.date,
          title: j.title,
          description: j.description,
          icon: j.icon
        })))
      }

      if (settingsRes.data) {
        setCvUrlState(settingsRes.data.value)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Project CRUD
  const addProject = async (project: Omit<Project, 'id'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        image_url: project.imageUrl,
        link_url: project.linkUrl,
        date: project.date,
        is_featured: project.isFeatured || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding project:', error)
      return
    }

    if (data) {
      setProjects(prev => [{
        id: data.id,
        title: data.title,
        description: data.description,
        technologies: data.technologies || [],
        imageUrl: data.image_url,
        linkUrl: data.link_url,
        date: data.date,
        isFeatured: data.is_featured
      }, ...prev])
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.technologies !== undefined) dbUpdates.technologies = updates.technologies
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl
    if (updates.linkUrl !== undefined) dbUpdates.link_url = updates.linkUrl
    if (updates.date !== undefined) dbUpdates.date = updates.date
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured

    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating project:', error)
      return
    }

    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      console.error('Error deleting project:', error)
      return
    }
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  // Skill CRUD
  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        name: skill.name,
        level: skill.level,
        category: skill.category,
        icon: skill.icon,
        description: skill.description,
        year_started: skill.yearStarted,
        is_primary: skill.isPrimary
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding skill:', error)
      return
    }

    if (data) {
      setSkills(prev => [...prev, {
        id: data.id,
        name: data.name,
        level: data.level,
        category: data.category,
        icon: data.icon,
        description: data.description,
        yearStarted: data.year_started,
        isPrimary: data.is_primary
      }])
    }
  }

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.level !== undefined) dbUpdates.level = updates.level
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.yearStarted !== undefined) dbUpdates.year_started = updates.yearStarted
    if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary

    const { error } = await supabase.from('skills').update(dbUpdates).eq('id', id)
    if (error) {
      console.error('Error updating skill:', error)
      return
    }
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) {
      console.error('Error deleting skill:', error)
      return
    }
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  // Learning Item CRUD
  const addLearningItem = async (item: Omit<LearningItem, 'id'>) => {
    const { data, error } = await supabase
      .from('learning_items')
      .insert({ name: item.name, description: item.description })
      .select()
      .single()

    if (error) {
      console.error('Error adding learning item:', error)
      return
    }

    if (data) {
      setLearningItems(prev => [...prev, { id: data.id, name: data.name, description: data.description }])
    }
  }

  const deleteLearningItem = async (id: string) => {
    const { error } = await supabase.from('learning_items').delete().eq('id', id)
    if (error) {
      console.error('Error deleting learning item:', error)
      return
    }
    setLearningItems(prev => prev.filter(i => i.id !== id))
  }

  // Testimonial CRUD
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
        linkedin_url: testimonial.linkedinUrl || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding testimonial:', error)
      return
    }

    if (data) {
      setTestimonials(prev => [...prev, {
        id: data.id,
        name: data.name,
        role: data.role,
        company: data.company,
        content: data.content,
        linkedinUrl: data.linkedin_url
      }])
    }
  }

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.role !== undefined) dbUpdates.role = updates.role
    if (updates.company !== undefined) dbUpdates.company = updates.company
    if (updates.content !== undefined) dbUpdates.content = updates.content
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl

    const { error } = await supabase.from('testimonials').update(dbUpdates).eq('id', id)
    if (error) {
      console.error('Error updating testimonial:', error)
      return
    }
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) {
      console.error('Error deleting testimonial:', error)
      return
    }
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  // Journey Event CRUD
  const addJourneyEvent = async (event: Omit<JourneyEvent, 'id'>) => {
    const { data, error } = await supabase
      .from('journey_events')
      .insert({
        date: event.date,
        title: event.title,
        description: event.description,
        icon: event.icon
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding journey event:', error)
      return
    }

    if (data) {
      setJourneyEvents(prev => [...prev, {
        id: data.id,
        date: data.date,
        title: data.title,
        description: data.description,
        icon: data.icon
      }])
    }
  }

  const updateJourneyEvent = async (id: string, updates: Partial<JourneyEvent>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.date !== undefined) dbUpdates.date = updates.date
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon

    const { error } = await supabase.from('journey_events').update(dbUpdates).eq('id', id)
    if (error) {
      console.error('Error updating journey event:', error)
      return
    }
    setJourneyEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteJourneyEvent = async (id: string) => {
    const { error } = await supabase.from('journey_events').delete().eq('id', id)
    if (error) {
      console.error('Error deleting journey event:', error)
      return
    }
    setJourneyEvents(prev => prev.filter(e => e.id !== id))
  }

  // CV URL
  const setCvUrl = async (url: string) => {
    const { error } = await supabase
      .from('settings')
      .update({ value: url })
      .eq('key', 'cv_url')

    if (error) {
      console.error('Error updating CV URL:', error)
      return
    }
    setCvUrlState(url)
  }

  return (
    <PortfolioDataContext.Provider
      value={{
        projects,
        skills,
        learningItems,
        testimonials,
        journeyEvents,
        cvUrl,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        updateSkill,
        deleteSkill,
        addLearningItem,
        deleteLearningItem,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addJourneyEvent,
        updateJourneyEvent,
        deleteJourneyEvent,
        setCvUrl,
        refreshData: fetchData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext)
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider')
  }
  return context
}
