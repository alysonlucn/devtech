export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const TechnologyDifficulty = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const
export type TechnologyDifficulty = (typeof TechnologyDifficulty)[keyof typeof TechnologyDifficulty]

export const TechnologyCategory = {
  FUNDAMENTALS: 'FUNDAMENTALS',
  BACKEND: 'BACKEND',
  FRONTEND: 'FRONTEND',
  DEVOPS: 'DEVOPS',
  DATABASE: 'DATABASE',
  TOOLING: 'TOOLING',
} as const
export type TechnologyCategory = (typeof TechnologyCategory)[keyof typeof TechnologyCategory]

export const ResourceType = {
  VIDEO: 'video',
  ARTICLE: 'article',
  DOCUMENTATION: 'documentation',
  BOOK: 'book',
  COURSE: 'course',
} as const
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType]

export const ProgressStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  READY_FOR_ASSESSMENT: 'READY_FOR_ASSESSMENT',
  VALIDATED: 'VALIDATED',
} as const
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus]

export const ProjectStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
} as const
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]
