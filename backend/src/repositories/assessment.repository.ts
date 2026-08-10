import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Assessment } from '../entities/assessment.entity';

export class AssessmentRepository {
  private get repository(): Repository<Assessment> {
    return AppDataSource.getRepository(Assessment);
  }

  async create(data: Partial<Assessment>): Promise<Assessment> {
    const assessment = this.repository.create(data);
    return this.repository.save(assessment);
  }

  async findByUser(userId: string): Promise<Assessment[]> {
    return this.repository.find({
      where: { userId },
      relations: ['technology'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndTechnology(userId: string, technologyId: string): Promise<Assessment[]> {
    return this.repository.find({
      where: { userId, technologyId },
      order: { createdAt: 'DESC' },
    });
  }
}
