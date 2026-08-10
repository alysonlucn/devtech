import { ProjectRepository } from '../../repositories/project.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { NotFoundError } from '../../errors/app.errors';
import { PaginatedResult, PaginationQuery } from '../../utils/pagination';
import { ProjectSuggestion } from '../../entities/project-suggestion.entity';
import { TechnologyDifficulty } from '../../enums';

export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<ProjectSuggestion>> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.projectRepository.findByTechnology(technologyId, query);
  }

  async findById(id: string): Promise<ProjectSuggestion> {
    const project = await this.projectRepository.findByIdWithTechnology(id);
    if (!project) throw new NotFoundError('Recurso não encontrado');
    return project;
  }

  async create(
    technologyId: string,
    data: { title: string; description: string; difficulty: TechnologyDifficulty },
  ): Promise<ProjectSuggestion> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.projectRepository.create({ ...data, technologyId });
  }

  async update(
    id: string,
    data: Partial<{ title: string; description: string; difficulty: TechnologyDifficulty }>,
  ): Promise<ProjectSuggestion> {
    return this.projectRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
