import { CompetencyRepository } from '../../repositories/competency.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { PaginatedResult, PaginationQuery } from '../../utils/pagination';
import { Competency } from '../../entities/competency.entity';

export class CompetencyService {
  constructor(
    private readonly competencyRepository: CompetencyRepository,
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<Competency>> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.competencyRepository.findByTechnology(technologyId, query);
  }

  async findById(id: string): Promise<Competency> {
    return this.competencyRepository.findByIdOrFail(id);
  }

  async create(technologyId: string, data: { title: string }): Promise<Competency> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.competencyRepository.create({ ...data, technologyId });
  }

  async update(id: string, data: Partial<{ title: string }>): Promise<Competency> {
    return this.competencyRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.competencyRepository.delete(id);
  }
}
