import { apiClient, unwrap } from '@/api/client'
import type {
  Assessment,
  AssessmentAnswer,
  Dashboard,
  JobAnalysisResult,
  RoadmapItem,
  RoadmapRecommendation,
  UserProject,
  UserTechnologyProgress,
} from '@/types/entities'
import type { ProgressStatus, ProjectStatus } from '@/types/enums'

export const userApi = {
  getDashboard: () => unwrap<Dashboard>(apiClient.get('/dashboard')),

  getRecommendations: () =>
    unwrap<RoadmapRecommendation>(apiClient.get('/recommendations')),

  getProgress: () =>
    unwrap<UserTechnologyProgress[]>(apiClient.get('/progress')),

  getRoadmap: () =>
    unwrap<RoadmapItem[]>(apiClient.get('/progress/roadmap')),

  startProgress: (technologyId: string) =>
    unwrap<UserTechnologyProgress>(apiClient.post('/progress/start', { technologyId })),

  updateProgress: (id: string, status: ProgressStatus) =>
    unwrap<UserTechnologyProgress>(apiClient.patch(`/progress/${id}`, { status })),

  markReady: (id: string) =>
    unwrap<UserTechnologyProgress>(apiClient.post(`/progress/${id}/ready`)),

  getProjects: () =>
    unwrap<UserProject[]>(apiClient.get('/projects')),

  startProject: (projectId: string) =>
    unwrap<UserProject>(apiClient.post('/projects/start', { projectId })),

  updateProject: (id: string, status: ProjectStatus) =>
    unwrap<UserProject>(apiClient.patch(`/projects/${id}`, { status })),

  getAssessments: () =>
    unwrap<Assessment[]>(apiClient.get('/assessments')),

  submitAssessment: (technologyId: string, answers: AssessmentAnswer[]) =>
    unwrap<Assessment>(apiClient.post(`/assessment/${technologyId}`, { answers })),

  analyzeJob: (jobDescription: string) =>
    unwrap<JobAnalysisResult>(apiClient.post('/job-analysis', { jobDescription })),

  setLearningPath: (learningPathId: string) =>
    unwrap<null>(apiClient.patch('/profile/learning-path', { learningPathId })),
}
