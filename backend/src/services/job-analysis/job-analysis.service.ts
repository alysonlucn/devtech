import { ProgressRepository } from '../../repositories/progress.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { LearningPathRepository } from '../../repositories/learning-path.repository';
import { LLMProvider } from '../../interfaces/llm/llm-provider.interface';
import { ProgressStatus } from '../../enums';

export class JobAnalysisService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly learningPathRepository: LearningPathRepository,
    private readonly llmProvider: LLMProvider,
  ) {}

  async analyzeJob(userId: string, jobDescription: string) {
    const profile = await this.userProfileRepository.findByUserId(userId);
    const progress = await this.progressRepository.findByUser(userId);

    const userTechnologies = progress
      .filter((p) => p.status === ProgressStatus.VALIDATED)
      .map((p) => p.technology.name);

    let learningPathTitle = 'Geral';
    if (profile?.learningPathId) {
      const path = await this.learningPathRepository.findById(profile.learningPathId);
      learningPathTitle = path?.title ?? learningPathTitle;
    }

    return this.llmProvider.jobAnalysis({
      jobDescription,
      userTechnologies,
      learningPathTitle,
    });
  }
}
