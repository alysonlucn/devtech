import { apiClient, unwrap, unwrapWithMeta } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { LearningPath, LearningPathTechnology } from '@/types/entities'

export interface LearningPathInput {
  title: string
  slug?: string
  description: string
}

export interface AddTechnologyToPathInput {
  technologyId: string
  order?: number
}

export const learningPathsApi = {
  list: (params?: PaginationParams) =>
    unwrapWithMeta<LearningPath[]>(apiClient.get('/learning-paths', { params })),

  getById: (id: string) =>
    unwrap<LearningPath>(apiClient.get(`/learning-paths/${id}`)),

  getTechnologies: (id: string) =>
    unwrap<LearningPathTechnology[]>(apiClient.get(`/learning-paths/${id}/technologies`)),

  create: (input: LearningPathInput) =>
    unwrap<LearningPath>(apiClient.post('/learning-paths', input)),

  update: (id: string, input: Partial<LearningPathInput>) =>
    unwrap<LearningPath>(apiClient.put(`/learning-paths/${id}`, input)),

  remove: (id: string) =>
    unwrap<null>(apiClient.delete(`/learning-paths/${id}`)),

  addTechnology: (id: string, input: AddTechnologyToPathInput) =>
    unwrap<LearningPathTechnology>(apiClient.post(`/learning-paths/${id}/technologies`, input)),

  removeTechnology: (id: string, technologyId: string) =>
    unwrap<null>(apiClient.delete(`/learning-paths/${id}/technologies/${technologyId}`)),
}
