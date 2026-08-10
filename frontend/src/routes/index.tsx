import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminRoute, GuestRoute, OnboardingRoute, ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/public/HomePage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { LearningPathsPage } from '@/pages/catalog/LearningPathsPage'
import { LearningPathDetailPage } from '@/pages/catalog/LearningPathDetailPage'
import { TechnologiesPage } from '@/pages/catalog/TechnologiesPage'
import { TechnologyDetailPage } from '@/pages/catalog/TechnologyDetailPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { OnboardingPage } from '@/pages/app/OnboardingPage'
import { RoadmapPage } from '@/pages/app/RoadmapPage'
import { ProgressPage } from '@/pages/app/ProgressPage'
import { ProjectsPage } from '@/pages/app/ProjectsPage'
import { ProjectChallengePage } from '@/pages/app/ProjectChallengePage'
import { RecommendationsPage } from '@/pages/app/RecommendationsPage'
import { JobAnalysisPage } from '@/pages/app/JobAnalysisPage'
import { AssessmentsPage } from '@/pages/app/AssessmentsPage'
import { AssessmentPage } from '@/pages/app/AssessmentPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { AdminLearningPathsPage } from '@/pages/admin/AdminLearningPathsPage'
import { AdminLearningPathDetailPage } from '@/pages/admin/AdminLearningPathDetailPage'
import { AdminTechnologiesPage } from '@/pages/admin/AdminTechnologiesPage'
import { AdminTechnologyDetailPage } from '@/pages/admin/AdminTechnologyDetailPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  { path: '/trilhas', element: <LearningPathsPage /> },
  { path: '/trilhas/:id', element: <LearningPathDetailPage /> },
  { path: '/tecnologias', element: <TechnologiesPage /> },
  { path: '/tecnologias/:id', element: <TechnologyDetailPage /> },
  {
    element: <OnboardingRoute />,
    children: [{ path: '/app/onboarding', element: <OnboardingPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/app/dashboard', element: <DashboardPage /> },
      { path: '/app/trilha', element: <RoadmapPage /> },
      { path: '/app/progresso', element: <ProgressPage /> },
      { path: '/app/projetos', element: <ProjectsPage /> },
      { path: '/app/desafios/:projectId', element: <ProjectChallengePage /> },
      { path: '/app/recomendacoes', element: <RecommendationsPage /> },
      { path: '/app/analise-vaga', element: <JobAnalysisPage /> },
      { path: '/app/avaliacoes', element: <AssessmentsPage /> },
      { path: '/app/avaliacoes/:technologyId', element: <AssessmentPage /> },
      { path: '/app/perfil', element: <ProfilePage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin/trilhas', element: <AdminLearningPathsPage /> },
      { path: '/admin/trilhas/:id', element: <AdminLearningPathDetailPage /> },
      { path: '/admin/tecnologias', element: <AdminTechnologiesPage /> },
      { path: '/admin/tecnologias/:id', element: <AdminTechnologyDetailPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
