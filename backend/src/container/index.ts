import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { UserStreakRepository } from '../repositories/user-streak.repository';
import { LearningPathRepository } from '../repositories/learning-path.repository';
import { LearningPathTechnologyRepository } from '../repositories/learning-path-technology.repository';
import { TechnologyRepository } from '../repositories/technology.repository';
import { ResourceRepository } from '../repositories/resource.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { CompetencyRepository } from '../repositories/competency.repository';
import { TechnologyDependencyRepository } from '../repositories/technology-dependency.repository';
import { ProgressRepository } from '../repositories/progress.repository';
import { UserProjectRepository } from '../repositories/user-project.repository';
import { AssessmentRepository } from '../repositories/assessment.repository';

import { AuthService } from '../services/auth/auth.service';
import { LearningPathService } from '../services/learning-path/learning-path.service';
import { TechnologyService } from '../services/technology/technology.service';
import { ResourceService } from '../services/resource/resource.service';
import { ProjectService } from '../services/project/project.service';
import { CompetencyService } from '../services/competency/competency.service';
import { DependencyService } from '../services/dependency/dependency.service';
import { ProgressService } from '../services/progress/progress.service';
import { UserProjectService } from '../services/project/user-project.service';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { AssessmentService } from '../services/assessment/assessment.service';
import { RecommendationService } from '../services/recommendation/recommendation.service';
import { JobAnalysisService } from '../services/job-analysis/job-analysis.service';

import { createLLMProvider } from '../providers/llm';
import { LLMProvider } from '../interfaces/llm/llm-provider.interface';

// Repositories
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const userProfileRepository = new UserProfileRepository();
const userStreakRepository = new UserStreakRepository();
const learningPathRepository = new LearningPathRepository();
const lptRepository = new LearningPathTechnologyRepository();
const technologyRepository = new TechnologyRepository();
const resourceRepository = new ResourceRepository();
const projectRepository = new ProjectRepository();
const competencyRepository = new CompetencyRepository();
const dependencyRepository = new TechnologyDependencyRepository();
const progressRepository = new ProgressRepository();
const userProjectRepository = new UserProjectRepository();
const assessmentRepository = new AssessmentRepository();

// LLM Provider
const llmProvider: LLMProvider = createLLMProvider();

// Services
export const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  userProfileRepository,
  userStreakRepository,
);

export const learningPathService = new LearningPathService(learningPathRepository, lptRepository);
export const technologyService = new TechnologyService(technologyRepository);
export const resourceService = new ResourceService(resourceRepository, technologyRepository);
export const projectService = new ProjectService(projectRepository, technologyRepository);
export const competencyService = new CompetencyService(competencyRepository, technologyRepository);
export const dependencyService = new DependencyService(dependencyRepository, technologyRepository);
export const progressService = new ProgressService(
  progressRepository,
  technologyRepository,
  dependencyRepository,
  userProfileRepository,
  userStreakRepository,
  lptRepository,
);
export const userProjectService = new UserProjectService(
  userProjectRepository,
  projectRepository,
  userProfileRepository,
);
export const dashboardService = new DashboardService(
  progressRepository,
  userProfileRepository,
  userStreakRepository,
  userProjectRepository,
  competencyRepository,
  lptRepository,
);
export const assessmentService = new AssessmentService(
  assessmentRepository,
  progressRepository,
  technologyRepository,
  competencyRepository,
  userProfileRepository,
  llmProvider,
);
export const recommendationService = new RecommendationService(
  progressRepository,
  userProfileRepository,
  learningPathRepository,
  lptRepository,
  llmProvider,
);
export const jobAnalysisService = new JobAnalysisService(
  progressRepository,
  userProfileRepository,
  learningPathRepository,
  llmProvider,
);

export { userProfileRepository };
