import type {
  ProgressStatus,
  ProjectStatus,
  ResourceType,
  TechnologyCategory,
  TechnologyDifficulty,
  UserRole,
} from './enums'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface UserProfile {
  totalXp: number
  learningPathId: string | null
}

export interface UserStreak {
  currentStreak: number
  longestStreak: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: TokenPair
}

export interface MeResponse extends User {
  profile: UserProfile
  streak: UserStreak
}

export interface LearningPath {
  id: string
  title: string
  slug: string
  description: string
  technologies?: LearningPathTechnology[]
}

export interface Technology {
  id: string
  name: string
  slug: string
  description: string
  whyLearn: string
  whenLearn: string
  estimatedTime: number
  difficulty: TechnologyDifficulty
  order: number
  category: TechnologyCategory
  createdAt?: string
  updatedAt?: string
  resources?: Resource[]
  projects?: ProjectSuggestion[]
  competencies?: Competency[]
  dependencies?: TechnologyDependency[]
}

export interface LearningPathTechnology {
  learningPathId: string
  technologyId: string
  order: number
  technology?: Technology
}

export interface Resource {
  id: string
  technologyId: string
  title: string
  type: ResourceType
  url: string
}

export interface ProjectSuggestion {
  id: string
  technologyId: string
  title: string
  description: string
  difficulty: TechnologyDifficulty
}

export interface Competency {
  id: string
  technologyId: string
  title: string
}

export interface TechnologyDependency {
  technologyId: string
  prerequisiteTechnologyId: string
  prerequisiteTechnology?: Technology
}

export interface UserTechnologyProgress {
  id: string
  userId: string
  technologyId: string
  status: ProgressStatus
  score: number | null
  completedAt: string | null
  technology?: Technology
}

export interface UserProject {
  id: string
  userId: string
  projectId: string
  status: ProjectStatus
  project?: ProjectSuggestion & { technology?: Technology }
}

export interface Assessment {
  id: string
  userId: string
  technologyId: string
  score: number
  feedback: string
  masteredCompetencies: string[]
  weakCompetencies: string[]
  createdAt: string
}

export interface Dashboard {
  xp: number
  currentStreak: number
  longestStreak: number
  progressPercentage: number
  completedTechnologies: Technology[]
  inProgressTechnologies: Technology[]
  remainingTechnologies: Technology[]
  competencies: string[]
  projects: UserProject[]
  learningPathId: string | null
}

export interface RoadmapRecommendation {
  nextStep: string
  technologiesToReview: string[]
  recommendedProject: string | null
  reasoning: string
}

export interface RoadmapItem {
  technology: Technology
  order: number
  status: ProgressStatus
  score: number | null
  progressId: string | null
  prerequisites: Technology[]
}

export interface JobAnalysisResult {
  matchedTechnologies: string[]
  missingTechnologies: string[]
  suggestedPlan: string
  matchPercentage: number
}

export interface AssessmentAnswer {
  question: string
  answer: string
}
