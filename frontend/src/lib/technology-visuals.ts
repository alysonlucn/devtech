import type { TechnologyCategory } from '@/types/enums'

interface TechVisual {
  emoji: string
  gradient: string
  ring: string
}

const SLUG_VISUALS: Record<string, TechVisual> = {
  javascript: { emoji: 'JS', gradient: 'from-cyan-600 to-teal-700', ring: 'ring-cyan-200 dark:ring-cyan-900' },
  typescript: { emoji: 'TS', gradient: 'from-blue-600 to-indigo-700', ring: 'ring-blue-200 dark:ring-blue-900' },
  html: { emoji: 'HTML', gradient: 'from-sky-600 to-cyan-700', ring: 'ring-sky-200 dark:ring-sky-900' },
  css: { emoji: 'CSS', gradient: 'from-indigo-500 to-blue-700', ring: 'ring-indigo-200 dark:ring-indigo-900' },
  react: { emoji: 'Re', gradient: 'from-cyan-500 to-blue-600', ring: 'ring-cyan-200 dark:ring-cyan-900' },
  nodejs: { emoji: 'Node', gradient: 'from-teal-600 to-emerald-700', ring: 'ring-teal-200 dark:ring-teal-900' },
  'node-js': { emoji: 'Node', gradient: 'from-teal-600 to-emerald-700', ring: 'ring-teal-200 dark:ring-teal-900' },
  python: { emoji: 'Py', gradient: 'from-blue-600 to-cyan-600', ring: 'ring-blue-200 dark:ring-blue-900' },
  docker: { emoji: 'Dk', gradient: 'from-sky-500 to-blue-700', ring: 'ring-sky-200 dark:ring-sky-900' },
  git: { emoji: 'Git', gradient: 'from-teal-700 to-cyan-800', ring: 'ring-teal-200 dark:ring-teal-900' },
  sql: { emoji: 'SQL', gradient: 'from-indigo-600 to-violet-700', ring: 'ring-indigo-200 dark:ring-indigo-900' },
  postgres: { emoji: 'PG', gradient: 'from-blue-700 to-indigo-800', ring: 'ring-blue-200 dark:ring-blue-900' },
  mongodb: { emoji: 'Mo', gradient: 'from-emerald-700 to-teal-800', ring: 'ring-emerald-200 dark:ring-emerald-900' },
  aws: { emoji: 'AWS', gradient: 'from-cyan-700 to-slate-700', ring: 'ring-cyan-200 dark:ring-cyan-900' },
  linux: { emoji: 'Lx', gradient: 'from-slate-600 to-slate-800', ring: 'ring-slate-200 dark:ring-slate-700' },
}

const CATEGORY_VISUALS: Record<TechnologyCategory, TechVisual> = {
  FUNDAMENTALS: { emoji: 'Fd', gradient: 'from-violet-600 to-indigo-700', ring: 'ring-violet-200 dark:ring-violet-900' },
  FRONTEND: { emoji: 'Fe', gradient: 'from-cyan-500 to-sky-600', ring: 'ring-cyan-200 dark:ring-cyan-900' },
  BACKEND: { emoji: 'Be', gradient: 'from-teal-600 to-emerald-700', ring: 'ring-teal-200 dark:ring-teal-900' },
  DATABASE: { emoji: 'Db', gradient: 'from-indigo-600 to-blue-700', ring: 'ring-indigo-200 dark:ring-indigo-900' },
  DEVOPS: { emoji: 'Ops', gradient: 'from-sky-700 to-slate-700', ring: 'ring-sky-200 dark:ring-sky-900' },
  TOOLING: { emoji: 'Tl', gradient: 'from-slate-500 to-slate-700', ring: 'ring-slate-200 dark:ring-slate-700' },
}

const PATH_GRADIENTS = [
  'from-cyan-600 via-teal-500 to-sky-500',
  'from-indigo-500 via-blue-500 to-cyan-500',
  'from-teal-600 via-emerald-600 to-cyan-600',
  'from-violet-500 via-indigo-500 to-blue-500',
  'from-sky-600 via-cyan-500 to-teal-500',
]

export function getTechnologyVisual(slug: string, category?: TechnologyCategory): TechVisual {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (SLUG_VISUALS[normalized]) return SLUG_VISUALS[normalized]
  if (category && CATEGORY_VISUALS[category]) return CATEGORY_VISUALS[category]
  return { emoji: 'Dev', gradient: 'from-slate-500 to-slate-700', ring: 'ring-slate-200 dark:ring-slate-700' }
}

export function getPathGradient(index: number): string {
  return PATH_GRADIENTS[index % PATH_GRADIENTS.length]
}
