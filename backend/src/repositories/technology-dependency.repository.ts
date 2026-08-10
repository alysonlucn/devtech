import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { TechnologyDependency } from '../entities/technology-dependency.entity';
import { NotFoundError } from '../errors/app.errors';

export class TechnologyDependencyRepository {
  private get repository(): Repository<TechnologyDependency> {
    return AppDataSource.getRepository(TechnologyDependency);
  }

  async findByTechnology(technologyId: string): Promise<TechnologyDependency[]> {
    return this.repository.find({
      where: { technologyId },
      relations: ['prerequisiteTechnology'],
    });
  }

  async create(technologyId: string, prerequisiteTechnologyId: string): Promise<TechnologyDependency> {
    const dep = this.repository.create({ technologyId, prerequisiteTechnologyId });
    return this.repository.save(dep);
  }

  async delete(technologyId: string, prerequisiteTechnologyId: string): Promise<void> {
    const result = await this.repository.delete({ technologyId, prerequisiteTechnologyId });
    if (result.affected === 0) {
      throw new NotFoundError('Dependência não encontrada');
    }
  }

  async getPrerequisites(technologyId: string): Promise<string[]> {
    const deps = await this.repository.find({ where: { technologyId } });
    return deps.map((d) => d.prerequisiteTechnologyId);
  }
}
