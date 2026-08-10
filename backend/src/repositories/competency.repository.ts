import { BaseRepository } from './base.repository';
import { Competency } from '../entities/competency.entity';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';

export class CompetencyRepository extends BaseRepository<Competency> {
  protected entity = Competency;

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<Competency>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [items, total] = await this.repository.findAndCount({
      where: { technologyId },
      skip,
      take,
      order: { title: query.order === 'asc' ? 'ASC' : 'DESC' },
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async findByTechnologyId(technologyId: string): Promise<Competency[]> {
    return this.repository.find({ where: { technologyId } });
  }
}
