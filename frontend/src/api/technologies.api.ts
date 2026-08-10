import { apiClient, unwrap, unwrapWithMeta } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type {
  Competency,
  ProjectSuggestion,
  Resource,
  Technology,
  TechnologyDependency,
} from '@/types/entities'
import type { TechnologyCategory, TechnologyDifficulty } from '@/types/enums'

export interface TechnologyInput {
  name: string
  slug?: string
  description: string
  whyLearn: string
  whenLearn: string
  estimatedTime: number
  difficulty: TechnologyDifficulty
  order?: number
  category: TechnologyCategory
}

export interface ResourceInput {
  title: string
  type: string
  url: string
}

export interface ProjectInput {
  title: string
  description: string
  difficulty: TechnologyDifficulty
}

export interface CompetencyInput {
  title: string
}

export interface DependencyInput {
  prerequisiteTechnologyId: string
}

export interface TechnologyQueryParams extends PaginationParams {
  category?: TechnologyCategory
}

export const technologiesApi = {
  list: (params?: TechnologyQueryParams) =>
    unwrapWithMeta<Technology[]>(apiClient.get('/technologies', { params })),

  getById: (id: string) =>
    unwrap<Technology>(apiClient.get(`/technologies/${id}`)),

  create: (input: TechnologyInput) =>
    unwrap<Technology>(apiClient.post('/technologies', input)),

  update: (id: string, input: Partial<TechnologyInput>) =>
    unwrap<Technology>(apiClient.put(`/technologies/${id}`, input)),

  remove: (id: string) =>
    unwrap<null>(apiClient.delete(`/technologies/${id}`)),

  listResources: (technologyId: string, params?: PaginationParams) =>
    unwrapWithMeta<Resource[]>(apiClient.get(`/technologies/${technologyId}/resources`, { params })),

  createResource: (technologyId: string, input: ResourceInput) =>
    unwrap<Resource>(apiClient.post(`/technologies/${technologyId}/resources`, input)),

  updateResource: (id: string, input: ResourceInput) =>
    unwrap<Resource>(apiClient.put(`/technologies/resources/${id}`, input)),

  removeResource: (id: string) =>
    unwrap<null>(apiClient.delete(`/technologies/resources/${id}`)),

  listProjects: (technologyId: string, params?: PaginationParams) =>
    unwrapWithMeta<ProjectSuggestion[]>(apiClient.get(`/technologies/${technologyId}/projects`, { params })),

  createProject: (technologyId: string, input: ProjectInput) =>
    unwrap<ProjectSuggestion>(apiClient.post(`/technologies/${technologyId}/projects`, input)),

  getProject: (id: string) =>
    unwrap<ProjectSuggestion>(apiClient.get(`/technologies/projects/${id}`)),

  updateProject: (id: string, input: ProjectInput) =>
    unwrap<ProjectSuggestion>(apiClient.put(`/technologies/projects/${id}`, input)),

  removeProject: (id: string) =>
    unwrap<null>(apiClient.delete(`/technologies/projects/${id}`)),

  listCompetencies: (technologyId: string, params?: PaginationParams) =>
    unwrapWithMeta<Competency[]>(apiClient.get(`/technologies/${technologyId}/competencies`, { params })),

  createCompetency: (technologyId: string, input: CompetencyInput) =>
    unwrap<Competency>(apiClient.post(`/technologies/${technologyId}/competencies`, input)),

  updateCompetency: (id: string, input: CompetencyInput) =>
    unwrap<Competency>(apiClient.put(`/technologies/competencies/${id}`, input)),

  removeCompetency: (id: string) =>
    unwrap<null>(apiClient.delete(`/technologies/competencies/${id}`)),

  listDependencies: (technologyId: string) =>
    unwrap<TechnologyDependency[]>(apiClient.get(`/technologies/${technologyId}/dependencies`)),

  createDependency: (technologyId: string, input: DependencyInput) =>
    unwrap<TechnologyDependency>(apiClient.post(`/technologies/${technologyId}/dependencies`, input)),

  removeDependency: (technologyId: string, prerequisiteId: string) =>
    unwrap<null>(apiClient.delete(`/technologies/${technologyId}/dependencies/${prerequisiteId}`)),
}
