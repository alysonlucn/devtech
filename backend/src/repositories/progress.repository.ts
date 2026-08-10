import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { UserTechnologyProgress } from '../entities/user-technology-progress.entity';
import { ProgressStatus } from '../enums';
import { NotFoundError } from '../errors/app.errors';

export class ProgressRepository {
  private get repository(): Repository<UserTechnologyProgress> {
    return AppDataSource.getRepository(UserTechnologyProgress);
  }

  async findByUserAndTechnology(
    userId: string,
    technologyId: string,
  ): Promise<UserTechnologyProgress | null> {
    return this.repository.findOne({
      where: { userId, technologyId },
      relations: ['technology'],
    });
  }

  async findById(id: string): Promise<UserTechnologyProgress | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['technology'],
    });
  }

  async findByIdOrFail(id: string): Promise<UserTechnologyProgress> {
    const progress = await this.findById(id);
    if (!progress) throw new NotFoundError('Progresso não encontrado');
    return progress;
  }

  async findByUser(userId: string): Promise<UserTechnologyProgress[]> {
    return this.repository.find({
      where: { userId },
      relations: ['technology'],
      order: { updatedAt: 'DESC' },
    });
  }

  async create(data: Partial<UserTechnologyProgress>): Promise<UserTechnologyProgress> {
    const progress = this.repository.create(data);
    return this.repository.save(progress);
  }

  async update(id: string, data: Partial<UserTechnologyProgress>): Promise<UserTechnologyProgress> {
    await this.repository.update(id, data);
    return this.findByIdOrFail(id);
  }

  async countByUserAndStatus(userId: string, status: ProgressStatus): Promise<number> {
    return this.repository.count({ where: { userId, status } });
  }
}
