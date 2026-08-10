import type {
  ProgressStatus,
  ProjectStatus,
  ResourceType,
  TechnologyCategory,
  TechnologyDifficulty,
} from '@/types/enums'

export const difficultyLabels: Record<TechnologyDifficulty, string> = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
}

export const categoryLabels: Record<TechnologyCategory, string> = {
  FUNDAMENTALS: 'Fundamentos',
  BACKEND: 'Back-end',
  FRONTEND: 'Front-end',
  DEVOPS: 'DevOps e infraestrutura',
  DATABASE: 'Banco de Dados',
  TOOLING: 'Ferramentas',
}

export const progressStatusLabels: Record<ProgressStatus, string> = {
  NOT_STARTED: 'Não iniciada',
  IN_PROGRESS: 'Em progresso',
  READY_FOR_ASSESSMENT: 'Pronta para avaliação',
  VALIDATED: 'Validada',
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  NOT_STARTED: 'Não iniciado',
  IN_PROGRESS: 'Em progresso',
  FINISHED: 'Concluído',
}

export const resourceTypeLabels: Record<ResourceType, string> = {
  video: 'Vídeo',
  article: 'Artigo',
  documentation: 'Documentação',
  book: 'Livro',
  course: 'Curso',
}

export const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({
  value,
  label,
}))

export const difficultyOptions = Object.entries(difficultyLabels).map(([value, label]) => ({
  value,
  label,
}))

export const resourceTypeOptions = Object.entries(resourceTypeLabels).map(([value, label]) => ({
  value,
  label,
}))
