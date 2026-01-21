import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbProject {
  id: string
  title: string
  description: string
  technologies: string[]
  image_url: string
  link_url: string
  date: string
  is_featured: boolean
  created_at?: string
}

export interface DbSkill {
  id: string
  name: string
  level: 'Expert' | 'Intermediate' | 'Beginner'
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai'
  icon: string
  description: string
  year_started: number
  is_primary: boolean
  created_at?: string
}

export interface DbLearningItem {
  id: string
  name: string
  description: string
  created_at?: string
}

export interface DbTestimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  linkedin_url?: string
  created_at?: string
}

export interface DbJourneyEvent {
  id: string
  date: string
  title: string
  description: string
  icon: string
  created_at?: string
}

export interface DbSettings {
  id: string
  key: string
  value: string
  created_at?: string
}
