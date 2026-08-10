import { TechnologyDependencyRepository } from '../../repositories/technology-dependency.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { ConflictError, ValidationError } from '../../errors/app.errors';
import { TechnologyDependency } from '../../entities/technology-dependency.entity';

export class DependencyService {
  constructor(
    private readonly dependencyRepository: TechnologyDependencyRepository,
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async findByTechnology(technologyId: string): Promise<TechnologyDependency[]> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.dependencyRepository.findByTechnology(technologyId);
  }

  async create(technologyId: string, prerequisiteTechnologyId: string): Promise<TechnologyDependency> {
    if (technologyId === prerequisiteTechnologyId) {
      throw new ValidationError('Uma tecnologia não pode depender de si mesma');
    }

    await this.technologyRepository.findByIdOrFail(technologyId);
    await this.technologyRepository.findByIdOrFail(prerequisiteTechnologyId);

    const wouldCycle = await this.detectCycle(technologyId, prerequisiteTechnologyId);
    if (wouldCycle) {
      throw new ValidationError('Esta dependência criaria uma referência circular');
    }

    try {
      return await this.dependencyRepository.create(technologyId, prerequisiteTechnologyId);
    } catch {
      throw new ConflictError('Dependência já existe');
    }
  }

  async delete(technologyId: string, prerequisiteTechnologyId: string): Promise<void> {
    await this.dependencyRepository.delete(technologyId, prerequisiteTechnologyId);
  }

  private async detectCycle(technologyId: string, prerequisiteId: string): Promise<boolean> {
    const visited = new Set<string>();
    const stack = [prerequisiteId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === technologyId) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      const prereqs = await this.dependencyRepository.getPrerequisites(current);
      stack.push(...prereqs);
    }

    return false;
  }
}
