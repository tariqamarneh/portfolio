'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, LogOut, Plus, Trash2, Edit2, Save, X,
  FolderGit2, Code2, Sparkles, Star, Eye, EyeOff,
  MessageSquare, Clock, FileText, Linkedin,
  Upload, GripVertical, ExternalLink, Github
} from 'lucide-react'
import { usePortfolioData, Skill, LearningItem, Testimonial, JourneyEvent } from '@/context/PortfolioDataContext'
import { Project } from '@/components/projects/ProjectsSection'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Tab = 'projects' | 'skills' | 'learning' | 'testimonials' | 'journey' | 'cv'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  useEffect(() => {
    // Check if already authenticated via HTTP-only cookie
    fetch('/api/auth')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        setIsAuthenticated(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
            <p className="text-gray-400 text-center mb-8">Enter your credentials to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'projects' as Tab, label: 'Projects', icon: FolderGit2 },
            { key: 'skills' as Tab, label: 'Skills', icon: Code2 },
            { key: 'learning' as Tab, label: 'Learning', icon: Sparkles },
            { key: 'testimonials' as Tab, label: 'Testimonials', icon: MessageSquare },
            { key: 'journey' as Tab, label: 'Journey', icon: Clock },
            { key: 'cv' as Tab, label: 'CV', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors text-sm
                  ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'learning' && <LearningManager />}
        {activeTab === 'testimonials' && <TestimonialsManager />}
        {activeTab === 'journey' && <JourneyManager />}
        {activeTab === 'cv' && <CVManager />}
      </div>
    </div>
  )
}

function SortableProjectItem({ project, onEdit, onDelete }: {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const linkTypeLabel = { live: 'Live Demo', github: 'GitHub', both: 'Both' }

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 flex-shrink-0 touch-none">
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
        {project.imageUrl && (
          <Image src={project.imageUrl} alt={project.title} width={80} height={56} className="object-cover w-full h-full" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white truncate">{project.title}</h3>
          {project.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
          <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
            project.linkType === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
            project.linkType === 'both' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-700 text-gray-400'
          }`}>
            {linkTypeLabel[project.linkType || 'github']}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
        <p className="text-xs text-gray-500">{project.date}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onEdit(project)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" aria-label={`Edit ${project.title}`}>
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => { if (window.confirm(`Delete "${project.title}"?`)) onDelete(project.id) }} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700" aria-label={`Delete ${project.title}`}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject, reorderProjects, uploadProjectImage } = usePortfolioData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [descTab, setDescTab] = useState<'write' | 'preview'>('write')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    linkUrl: '',
    date: '',
    isFeatured: false,
    sortOrder: 0,
    linkType: 'github',
    githubUrl: ''
  })
  const [techInput, setTechInput] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      imageUrl: '',
      linkUrl: '',
      date: '',
      isFeatured: false,
      sortOrder: 0,
      linkType: 'github',
      githubUrl: ''
    })
    setTechInput('')
    setEditingId(null)
    setShowForm(false)
    setDescTab('write')
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      imageUrl: project.imageUrl,
      linkUrl: project.linkUrl,
      date: project.date,
      isFeatured: project.isFeatured || false,
      sortOrder: project.sortOrder,
      linkType: project.linkType || 'github',
      githubUrl: project.githubUrl || ''
    })
    setEditingId(project.id)
    setShowForm(true)
    setDescTab('write')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProject(editingId, formData)
    } else {
      addProject(formData)
    }
    resetForm()
  }

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] })
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) })
  }

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    const url = await uploadProjectImage(file)
    if (url) {
      setFormData(prev => ({ ...prev, imageUrl: url }))
    }
    setUploading(false)
  }, [uploadProjectImage])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }, [handleImageUpload])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      const newOrder = arrayMove(projects, oldIndex, newIndex)
      reorderProjects(newOrder.map(p => p.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Projects ({projects.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  placeholder="e.g., February 2024"
                  required
                />
              </div>
            </div>

            {/* Markdown Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-700">
                  <button
                    type="button"
                    onClick={() => setDescTab('write')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      descTab === 'write' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescTab('preview')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      descTab === 'preview' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              {descTab === 'write' ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white font-mono text-sm"
                  rows={4}
                  placeholder="Supports **bold**, *italic*, `code`, and [links](url)"
                  required
                />
              ) : (
                <div className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 min-h-[6.5rem] prose prose-invert prose-sm max-w-none prose-p:my-1 prose-a:text-cyan-400">
                  {formData.description ? (
                    <ReactMarkdown>{formData.description}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 italic">Nothing to preview</p>
                  )}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Image</label>
              <div className="flex gap-4">
                <div
                  className={`flex-1 relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-400">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Upload className="w-6 h-6 text-gray-500" />
                      <p className="text-sm text-gray-400">Drop image here or click to upload</p>
                      <p className="text-xs text-gray-600">PNG, JPG, WebP</p>
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative group">
                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" sizes="128px" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">or paste URL:</span>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm"
                  placeholder="/images/project.png"
                />
              </div>
            </div>

            {/* Link Type & URLs */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Link Type</label>
                <div className="flex gap-2">
                  {([
                    { value: 'live' as const, label: 'Live Demo', icon: ExternalLink, color: 'emerald' },
                    { value: 'github' as const, label: 'GitHub Only', icon: Github, color: 'gray' },
                    { value: 'both' as const, label: 'Both', icon: Star, color: 'blue' },
                  ] as const).map((opt) => {
                    const Icon = opt.icon
                    const selected = formData.linkType === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, linkType: opt.value })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selected
                            ? opt.color === 'emerald' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                            : opt.color === 'blue' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                            : 'border-gray-600 bg-gray-700 text-gray-300'
                            : 'border-gray-700 bg-gray-800 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {formData.linkType === 'github' ? 'GitHub URL' : 'Live Demo URL'}
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    placeholder={formData.linkType === 'github' ? 'https://github.com/...' : 'https://myproject.com'}
                    required
                  />
                </div>
                {formData.linkType === 'both' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={formData.githubUrl || ''}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Technologies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  placeholder="Add technology"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="text-gray-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-300 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                Featured Project
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-gray-500">Drag to reorder projects</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {projects.map((project) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={deleteProject}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

function SkillsManager() {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolioData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '', level: 'Intermediate', category: 'backend', icon: '', description: '', yearStarted: new Date().getFullYear(), isPrimary: true
  })

  const resetForm = () => {
    setFormData({ name: '', level: 'Intermediate', category: 'backend', icon: '', description: '', yearStarted: new Date().getFullYear(), isPrimary: true })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (skill: Skill) => {
    setFormData({ name: skill.name, level: skill.level, category: skill.category, icon: skill.icon, description: skill.description, yearStarted: skill.yearStarted, isPrimary: skill.isPrimary })
    setEditingId(skill.id)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) { updateSkill(editingId, formData) } else { addSkill(formData) }
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Skills ({skills.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />Add Skill
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Icon URL</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="/skills_logo/icon.svg" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"><option value="backend">Backend</option><option value="frontend">Frontend</option><option value="database">Database</option><option value="devops">DevOps</option><option value="ai">AI/ML</option></select></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Level</label><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as Skill['level'] })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Expert">Expert</option></select></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Year Started</label><input type="number" value={formData.yearStarted} onChange={(e) => setFormData({ ...formData, yearStarted: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" min="2000" max={new Date().getFullYear()} required /></div>
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" id="isPrimary" checked={formData.isPrimary} onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })} className="w-4 h-4 rounded" /><label htmlFor="isPrimary" className="text-sm text-gray-300">Primary Skill</label></div>
            <div className="flex gap-2 justify-end"><button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600">Cancel</button><button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Save className="w-4 h-4" />{editingId ? 'Update' : 'Save'}</button></div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 flex items-center justify-center">
              <Image src={skill.icon} alt={skill.name} width={28} height={28} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2"><h3 className="font-semibold text-white">{skill.name}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${skill.isPrimary ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>{skill.isPrimary ? 'Primary' : 'Secondary'}</span></div>
              <p className="text-sm text-gray-400">{skill.category} - {skill.level}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(skill)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" aria-label={`Edit ${skill.name}`}><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if (window.confirm(`Delete "${skill.name}"?`)) deleteSkill(skill.id) }} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700" aria-label={`Delete ${skill.name}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LearningManager() {
  const { learningItems, addLearningItem, deleteLearningItem } = usePortfolioData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<LearningItem, 'id'>>({ name: '', description: '' })

  const resetForm = () => { setFormData({ name: '', description: '' }); setShowForm(false) }
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); addLearningItem(formData); resetForm() }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Currently Learning ({learningItems.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" />Add Item</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-white">Add Learning Item</h3><button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="e.g., Kubernetes" required /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="e.g., Learning container orchestration" required /></div>
            </div>
            <div className="flex gap-2 justify-end"><button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600">Cancel</button><button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Save className="w-4 h-4" />Save</button></div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {learningItems.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex-shrink-0 flex items-center justify-center"><Sparkles className="w-5 h-5 text-purple-400" /></div>
            <div className="flex-grow min-w-0"><h3 className="font-semibold text-white">{item.name}</h3><p className="text-sm text-gray-400">{item.description}</p></div>
            <button onClick={() => { if (window.confirm(`Delete "${item.name}"?`)) deleteLearningItem(item.id) }} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 flex-shrink-0" aria-label={`Delete ${item.name}`}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsManager() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolioData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({ name: '', role: '', company: '', content: '', linkedinUrl: '' })

  const resetForm = () => { setFormData({ name: '', role: '', company: '', content: '', linkedinUrl: '' }); setEditingId(null); setShowForm(false) }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({ name: testimonial.name, role: testimonial.role, company: testimonial.company, content: testimonial.content, linkedinUrl: testimonial.linkedinUrl || '' })
    setEditingId(testimonial.id); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) { updateTestimonial(editingId, formData) } else { addTestimonial(formData) }
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Testimonials ({testimonials.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" />Add Testimonial</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3><button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Role</label><input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Company</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Testimonial Content</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" rows={4} required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL (optional)</label><input type="text" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="https://linkedin.com/in/..." /></div>
            <div className="flex gap-2 justify-end"><button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600">Cancel</button><button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Save className="w-4 h-4" />{editingId ? 'Update' : 'Save'}</button></div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-400" /></div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  {testimonial.linkedinUrl && <Linkedin className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-sm text-gray-400 mb-2">{testimonial.role} at {testimonial.company}</p>
                <p className="text-sm text-gray-300 line-clamp-2">&ldquo;{testimonial.content}&rdquo;</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(testimonial)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" aria-label={`Edit ${testimonial.name}'s testimonial`}><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm(`Delete ${testimonial.name}'s testimonial?`)) deleteTestimonial(testimonial.id) }} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700" aria-label={`Delete ${testimonial.name}'s testimonial`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function JourneyManager() {
  const { journeyEvents, addJourneyEvent, updateJourneyEvent, deleteJourneyEvent } = usePortfolioData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<JourneyEvent, 'id'>>({ date: '', title: '', description: '', icon: '' })

  const resetForm = () => { setFormData({ date: '', title: '', description: '', icon: '' }); setEditingId(null); setShowForm(false) }

  const handleEdit = (event: JourneyEvent) => {
    setFormData({ date: event.date, title: event.title, description: event.description, icon: event.icon })
    setEditingId(event.id); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) { updateJourneyEvent(editingId, formData) } else { addJourneyEvent(formData) }
    resetForm()
  }

  const sortedEvents = [...journeyEvents].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Journey Events ({journeyEvents.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" />Add Event</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Event' : 'Add New Event'}</h3><button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Date (YYYY-MM)</label><input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="e.g., 2024-10" required /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" rows={3} required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Icon URL</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="/journey_logo/company.svg or URL" required /></div>
            <div className="flex gap-2 justify-end"><button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600">Cancel</button><button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Save className="w-4 h-4" />{editingId ? 'Update' : 'Save'}</button></div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center border-2 border-blue-500">
              <Image src={event.icon} alt={event.title} width={28} height={28} className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{event.date}</span>
                <h3 className="font-semibold text-white">{event.title}</h3>
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">{event.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(event)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" aria-label={`Edit ${event.title}`}><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if (window.confirm(`Delete "${event.title}"?`)) deleteJourneyEvent(event.id) }} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700" aria-label={`Delete ${event.title}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CVManager() {
  const { cvUrl, setCvUrl } = usePortfolioData()
  const [newUrl, setNewUrl] = useState(cvUrl)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setCvUrl(newUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">CV / Resume</h2>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CV File Path</label>
            <p className="text-xs text-gray-500 mb-2">Enter the path to your CV file in the public folder (e.g., /Tariq_Naser.pdf)</p>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
              placeholder="/your-cv.pdf"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                Preview current CV
              </a>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-3">How to update your CV:</h3>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
            <li>Upload your new CV file to the <code className="text-blue-400">/public</code> folder of your project</li>
            <li>Enter the file path above (e.g., <code className="text-blue-400">/My_New_CV.pdf</code>)</li>
            <li>Click Save Changes</li>
            <li>Redeploy your site to apply the changes</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
