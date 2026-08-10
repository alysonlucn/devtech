import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { UserProject } from '../entities/user-project.entity';
import { NotFoundError } from '../errors/app.errors';

export class UserProjectRepository {
  private get repository(): Repository<UserProject> {
    return AppDataSource.getRepository(UserProject);
  }

  async findByUser(userId: string): Promise<UserProject[]> {
    return this.repository.find({
      where: { userId },
      relations: ['project', 'project.technology'],
    });
  }

  async findByUserAndProject(userId: string, projectId: string): Promise<UserProject | null> {
    return this.repository.findOne({ where: { userId, projectId } });
  }

  async findById(id: string): Promise<UserProject | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async findByIdOrFail(id: string): Promise<UserProject> {
    const project = await this.findById(id);
    if (!project) throw new NotFoundError('Projeto do usuário não encontrado');
    return project;
  }

  async create(data: Partial<UserProject>): Promise<UserProject> {
    const userProject = this.repository.create(data);
    return this.repository.save(userProject);
  }

  async update(id: string, data: Partial<UserProject>): Promise<UserProject> {
    await this.repository.update(id, data);
    return this.findByIdOrFail(id);
  }
}
