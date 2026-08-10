import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { LearningPathTechnology } from '../entities/learning-path-technology.entity';
import { NotFoundError } from '../errors/app.errors';

export class LearningPathTechnologyRepository {
  private get repository(): Repository<LearningPathTechnology> {
    return AppDataSource.getRepository(LearningPathTechnology);
  }

  async findByLearningPath(learningPathId: string): Promise<LearningPathTechnology[]> {
    return this.repository.find({
      where: { learningPathId },
      relations: ['technology'],
      order: { order: 'ASC' },
    });
  }

  async create(data: Partial<LearningPathTechnology>): Promise<LearningPathTechnology> {
    const entry = this.repository.create(data);
    return this.repository.save(entry);
  }

  async delete(learningPathId: string, technologyId: string): Promise<void> {
    const result = await this.repository.delete({ learningPathId, technologyId });
    if (result.affected === 0) throw new NotFoundError('Tecnologia da trilha não encontrada');
  }
}
