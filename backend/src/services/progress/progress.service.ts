import { ProgressRepository } from '../../repositories/progress.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { TechnologyDependencyRepository } from '../../repositories/technology-dependency.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { UserStreakRepository } from '../../repositories/user-streak.repository';
import { LearningPathTechnologyRepository } from '../../repositories/learning-path-technology.repository';
import { ForbiddenError, ValidationError } from '../../errors/app.errors';
import { ProgressStatus } from '../../enums';
import { XP_REWARDS } from '../../utils/xp-calculator';
import { UserTechnologyProgress } from '../../entities/user-technology-progress.entity';

export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly technologyRepository: TechnologyRepository,
    private readonly dependencyRepository: TechnologyDependencyRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userStreakRepository: UserStreakRepository,
    private readonly lptRepository: LearningPathTechnologyRepository,
  ) {}

  async startTechnology(userId: string, technologyId: string): Promise<UserTechnologyProgress> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    await this.validatePrerequisites(userId, technologyId);

    const existing = await this.progressRepository.findByUserAndTechnology(userId, technologyId);
    if (existing) {
      if (existing.status !== ProgressStatus.NOT_STARTED) {
        throw new ValidationError('Tecnologia já iniciada');
      }
      return this.progressRepository.update(existing.id, { status: ProgressStatus.IN_PROGRESS });
    }

    const progress = await this.progressRepository.create({
      userId,
      technologyId,
      status: ProgressStatus.IN_PROGRESS,
    });

    await this.userProfileRepository.addXp(userId, XP_REWARDS.START_TECHNOLOGY);
    await this.updateStreak(userId);

    return progress;
  }

  async updateProgress(
    userId: string,
    progressId: string,
    status?: ProgressStatus,
  ): Promise<UserTechnologyProgress> {
    const progress = await this.progressRepository.findByIdOrFail(progressId);
    if (progress.userId !== userId) throw new ForbiddenError('Não é possível atualizar o progresso de outro usuário');

    if (status === ProgressStatus.VALIDATED) {
      throw new ValidationError('Use o endpoint de avaliação para validar uma tecnologia');
    }

    return this.progressRepository.update(progressId, {
      ...(status && { status }),
    });
  }

  async markReadyForAssessment(userId: string, progressId: string): Promise<UserTechnologyProgress> {
    const progress = await this.progressRepository.findByIdOrFail(progressId);
    if (progress.userId !== userId) throw new ForbiddenError('Não é possível atualizar o progresso de outro usuário');

    if (progress.status !== ProgressStatus.IN_PROGRESS) {
      throw new ValidationError('A tecnologia deve estar em progresso');
    }

    return this.progressRepository.update(progressId, { status: ProgressStatus.READY_FOR_ASSESSMENT });
  }

  async getUserProgress(userId: string): Promise<UserTechnologyProgress[]> {
    return this.progressRepository.findByUser(userId);
  }

  async getRoadmap(userId: string, learningPathId: string) {
    const pathTechnologies = await this.lptRepository.findByLearningPath(learningPathId);
    const userProgress = await this.progressRepository.findByUser(userId);
    const progressMap = new Map(userProgress.map((p) => [p.technologyId, p]));

    return pathTechnologies.map((lpt) => {
      const progress = progressMap.get(lpt.technologyId);
      const prerequisites = lpt.technology ? [] : [];
      return {
        technology: lpt.technology,
        order: lpt.order,
        status: progress?.status ?? ProgressStatus.NOT_STARTED,
        score: progress?.score ?? null,
        progressId: progress?.id ?? null,
        prerequisites,
      };
    });
  }

  private async validatePrerequisites(userId: string, technologyId: string): Promise<void> {
    const prerequisites = await this.dependencyRepository.getPrerequisites(technologyId);
    if (prerequisites.length === 0) return;

    for (const prereqId of prerequisites) {
      const progress = await this.progressRepository.findByUserAndTechnology(userId, prereqId);
      if (!progress || progress.status !== ProgressStatus.VALIDATED) {
        const prereq = await this.technologyRepository.findById(prereqId);
        throw new ValidationError(
          `Pré-requisito não validado: ${prereq?.name ?? prereqId}`,
        );
      }
    }
  }

  private async updateStreak(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const streak = await this.userStreakRepository.findByUserId(userId);
    if (!streak) return;

    if (streak.lastActivityDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 1;
    if (streak.lastActivityDate === yesterdayStr) {
      currentStreak = streak.currentStreak + 1;
    }

    await this.userStreakRepository.update(userId, {
      currentStreak,
      longestStreak: Math.max(streak.longestStreak, currentStreak),
      lastActivityDate: today,
    });
  }
}
