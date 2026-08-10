import { ProgressRepository } from '../../repositories/progress.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { UserStreakRepository } from '../../repositories/user-streak.repository';
import { UserProjectRepository } from '../../repositories/user-project.repository';
import { CompetencyRepository } from '../../repositories/competency.repository';
import { LearningPathTechnologyRepository } from '../../repositories/learning-path-technology.repository';
import { ProgressStatus } from '../../enums';

export class DashboardService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userStreakRepository: UserStreakRepository,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly competencyRepository: CompetencyRepository,
    private readonly lptRepository: LearningPathTechnologyRepository,
  ) {}

  async getDashboard(userId: string) {
    const [profile, streak, progress, projects] = await Promise.all([
      this.userProfileRepository.findByUserId(userId),
      this.userStreakRepository.findByUserId(userId),
      this.progressRepository.findByUser(userId),
      this.userProjectRepository.findByUser(userId),
    ]);

    const validated = progress.filter((p) => p.status === ProgressStatus.VALIDATED);
    const inProgress = progress.filter((p) => p.status === ProgressStatus.IN_PROGRESS);
    const remaining: unknown[] = [];

    if (profile?.learningPathId) {
      const pathTechs = await this.lptRepository.findByLearningPath(profile.learningPathId);
      for (const lpt of pathTechs) {
        const userProg = progress.find((p) => p.technologyId === lpt.technologyId);
        if (!userProg || userProg.status !== ProgressStatus.VALIDATED) {
          remaining.push(lpt.technology);
        }
      }
    }

    const competencies: string[] = [];
    for (const p of validated) {
      const comps = await this.competencyRepository.findByTechnologyId(p.technologyId);
      competencies.push(...comps.map((c) => c.title));
    }

    const totalInPath = profile?.learningPathId
      ? (await this.lptRepository.findByLearningPath(profile.learningPathId)).length
      : 0;

    const progressPercentage =
      totalInPath > 0 ? Math.round((validated.length / totalInPath) * 100) : 0;

    return {
      xp: profile?.totalXp ?? 0,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      progressPercentage,
      completedTechnologies: validated.map((p) => p.technology),
      inProgressTechnologies: inProgress.map((p) => p.technology),
      remainingTechnologies: remaining,
      competencies: [...new Set(competencies)],
      projects,
      learningPathId: profile?.learningPathId ?? null,
    };
  }
}
