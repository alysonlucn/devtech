import { AssessmentRepository } from '../../repositories/assessment.repository';
import { ProgressRepository } from '../../repositories/progress.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { CompetencyRepository } from '../../repositories/competency.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { LLMProvider } from '../../interfaces/llm/llm-provider.interface';
import { ValidationError } from '../../errors/app.errors';
import { ProgressStatus } from '../../enums';
import { env } from '../../config/env';
import { calculateValidationXp } from '../../utils/xp-calculator';
import { Assessment } from '../../entities/assessment.entity';

export class AssessmentService {
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly technologyRepository: TechnologyRepository,
    private readonly competencyRepository: CompetencyRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly llmProvider: LLMProvider,
  ) {}

  async submitAssessment(
    userId: string,
    technologyId: string,
    answers: { question: string; answer: string }[],
  ): Promise<Assessment> {
    const technology = await this.technologyRepository.findByIdOrFail(technologyId);
    const progress = await this.progressRepository.findByUserAndTechnology(userId, technologyId);

    if (!progress) {
      throw new ValidationError('Inicie a tecnologia antes de fazer a avaliação');
    }

    if (
      progress.status !== ProgressStatus.IN_PROGRESS &&
      progress.status !== ProgressStatus.READY_FOR_ASSESSMENT
    ) {
      throw new ValidationError('Tecnologia não elegível para avaliação');
    }

    const competencies = await this.competencyRepository.findByTechnologyId(technologyId);
    const competencyTitles = competencies.map((c) => c.title);

    const result = await this.llmProvider.assessment({
      technologyName: technology.name,
      competencies: competencyTitles,
      userAnswers: answers,
    });

    const assessment = await this.assessmentRepository.create({
      userId,
      technologyId,
      score: result.score,
      feedback: result.feedback,
      masteredCompetencies: result.masteredCompetencies,
      weakCompetencies: result.weakCompetencies,
    });

    if (result.score >= env.ASSESSMENT_PASS_SCORE) {
      await this.progressRepository.update(progress.id, {
        status: ProgressStatus.VALIDATED,
        score: result.score,
        completedAt: new Date(),
      });
      await this.userProfileRepository.addXp(userId, calculateValidationXp(result.score));
    } else {
      await this.progressRepository.update(progress.id, {
        status: ProgressStatus.IN_PROGRESS,
        score: result.score,
      });
    }

    return assessment;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return this.assessmentRepository.findByUser(userId);
  }
}
