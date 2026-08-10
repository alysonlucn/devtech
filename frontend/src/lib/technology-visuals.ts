import type { TechnologyCategory } from '@/types/enums'

interface TechVisual {
  emoji: string
  gradient: string
  ring: string
}

const SLUG_VISUALS: Record<string, TechVisual> = {
  javascript: { emoji: 'JS', gradient: 'from-yellow-400 to-amber-500', ring: 'ring-yellow-200' },
  typescript: { emoji: 'TS', gradient: 'from-blue-500 to-blue-700', ring: 'ring-blue-200' },
  html: { emoji: 'HTML', gradient: 'from-orange-500 to-red-500', ring: 'ring-orange-200' },
  css: { emoji: 'CSS', gradient: 'from-blue-400 to-indigo-500', ring: 'ring-blue-200' },
  react: { emoji: '⚛', gradient: 'from-cyan-400 to-blue-500', ring: 'ring-cyan-200' },
  nodejs: { emoji: 'Node', gradient: 'from-green-500 to-emerald-600', ring: 'ring-green-200' },
  'node-js': { emoji: 'Node', gradient: 'from-green-500 to-emerald-600', ring: 'ring-green-200' },
  python: { emoji: 'Py', gradient: 'from-blue-500 to-yellow-400', ring: 'ring-blue-200' },
  docker: { emoji: '🐳', gradient: 'from-sky-400 to-blue-600', ring: 'ring-sky-200' },
  git: { emoji: 'Git', gradient: 'from-orange-500 to-red-600', ring: 'ring-orange-200' },
  sql: { emoji: 'SQL', gradient: 'from-indigo-500 to-purple-600', ring: 'ring-indigo-200' },
  postgres: { emoji: 'PG', gradient: 'from-blue-600 to-indigo-700', ring: 'ring-blue-200' },
  mongodb: { emoji: 'Mongo', gradient: 'from-green-500 to-emerald-700', ring: 'ring-green-200' },
  aws: { emoji: 'AWS', gradient: 'from-orange-400 to-amber-600', ring: 'ring-orange-200' },
  linux: { emoji: '🐧', gradient: 'from-slate-600 to-slate-800', ring: 'ring-slate-200' },
}

const CATEGORY_VISUALS: Record<TechnologyCategory, TechVisual> = {
  FUNDAMENTALS: { emoji: '📚', gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-200' },
  FRONTEND: { emoji: '🎨', gradient: 'from-pink-500 to-rose-500', ring: 'ring-pink-200' },
  BACKEND: { emoji: '⚙️', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-200' },
  DATABASE: { emoji: '🗄️', gradient: 'from-indigo-500 to-blue-600', ring: 'ring-indigo-200' },
  DEVOPS: { emoji: '🚀', gradient: 'from-orange-500 to-red-500', ring: 'ring-orange-200' },
  TOOLING: { emoji: '🔧', gradient: 'from-slate-500 to-zinc-600', ring: 'ring-slate-200' },
}

const PATH_GRADIENTS = [
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-blue-500 via-indigo-500 to-violet-500',
  'from-rose-500 via-pink-500 to-fuchsia-500',
]

export function getTechnologyVisual(slug: string, category?: TechnologyCategory): TechVisual {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (SLUG_VISUALS[normalized]) return SLUG_VISUALS[normalized]
  if (category && CATEGORY_VISUALS[category]) return CATEGORY_VISUALS[category]
  return { emoji: '💻', gradient: 'from-slate-500 to-slate-700', ring: 'ring-slate-200' }
}

export function getPathGradient(index: number): string {
  return PATH_GRADIENTS[index % PATH_GRADIENTS.length]
}
