import { UserProjectRepository } from '../../repositories/user-project.repository';
import { ProjectRepository } from '../../repositories/project.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { ForbiddenError, ValidationError } from '../../errors/app.errors';
import { ProjectStatus } from '../../enums';
import { XP_REWARDS } from '../../utils/xp-calculator';
import { UserProject } from '../../entities/user-project.entity';

export class UserProjectService {
  constructor(
    private readonly userProjectRepository: UserProjectRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async findByUser(userId: string): Promise<UserProject[]> {
    return this.userProjectRepository.findByUser(userId);
  }

  async startProject(userId: string, projectId: string): Promise<UserProject> {
    await this.projectRepository.findByIdOrFail(projectId);

    const existing = await this.userProjectRepository.findByUserAndProject(userId, projectId);
    if (existing) throw new ValidationError('Projeto já iniciado');

    return this.userProjectRepository.create({
      userId,
      projectId,
      status: ProjectStatus.IN_PROGRESS,
    });
  }

  async updateStatus(userId: string, id: string, status: ProjectStatus): Promise<UserProject> {
    const userProject = await this.userProjectRepository.findByIdOrFail(id);
    if (userProject.userId !== userId) throw new ForbiddenError('Não é possível atualizar o projeto de outro usuário');

    const updated = await this.userProjectRepository.update(id, { status });

    if (status === ProjectStatus.FINISHED && userProject.status !== ProjectStatus.FINISHED) {
      await this.userProfileRepository.addXp(userId, XP_REWARDS.FINISH_PROJECT);
    }

    return updated;
  }
}
