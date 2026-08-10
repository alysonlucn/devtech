import { BaseRepository } from './base.repository';
import { ProjectSuggestion } from '../entities/project-suggestion.entity';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';

export class ProjectRepository extends BaseRepository<ProjectSuggestion> {
  protected entity = ProjectSuggestion;

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<ProjectSuggestion>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [items, total] = await this.repository.findAndCount({
      where: { technologyId },
      skip,
      take,
      order: { title: query.order === 'asc' ? 'ASC' : 'DESC' },
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async findByIdWithTechnology(id: string): Promise<ProjectSuggestion | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['technology'],
    });
  }
}
