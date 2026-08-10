import { ProgressRepository } from '../../repositories/progress.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { LearningPathRepository } from '../../repositories/learning-path.repository';
import { LearningPathTechnologyRepository } from '../../repositories/learning-path-technology.repository';
import { LLMProvider } from '../../interfaces/llm/llm-provider.interface';
import { ProgressStatus } from '../../enums';

export class RecommendationService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly learningPathRepository: LearningPathRepository,
    private readonly lptRepository: LearningPathTechnologyRepository,
    private readonly llmProvider: LLMProvider,
  ) {}

  async getRecommendations(userId: string) {
    const profile = await this.userProfileRepository.findByUserId(userId);
    const learningPathId = profile?.learningPathId;

    if (!learningPathId) {
      return {
        nextStep: 'Selecione uma trilha de aprendizagem para receber recomendações personalizadas',
        technologiesToReview: [],
        recommendedProject: null,
        reasoning: 'Nenhuma trilha de aprendizagem selecionada',
      };
    }

    const [learningPath, pathTechnologies, userProgress] = await Promise.all([
      this.learningPathRepository.findByIdOrFail(learningPathId),
      this.lptRepository.findByLearningPath(learningPathId),
      this.progressRepository.findByUser(userId),
    ]);

    const progressMap = new Map(userProgress.map((p) => [p.technologyId, p]));

    const allTechnologies = pathTechnologies.map((lpt) => ({
      name: lpt.technology.name,
      status: progressMap.get(lpt.technologyId)?.status ?? ProgressStatus.NOT_STARTED,
    }));

    const completedTechnologies = userProgress
      .filter((p) => p.status === ProgressStatus.VALIDATED)
      .map((p) => p.technology.name);

    const inProgressTechnologies = userProgress
      .filter((p) => p.status === ProgressStatus.IN_PROGRESS)
      .map((p) => p.technology.name);

    return this.llmProvider.roadmapRecommendation({
      learningPathTitle: learningPath.title,
      completedTechnologies,
      inProgressTechnologies,
      allTechnologies,
    });
  }
}
