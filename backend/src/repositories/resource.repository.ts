import { BaseRepository } from './base.repository';
import { Resource } from '../entities/resource.entity';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';

export class ResourceRepository extends BaseRepository<Resource> {
  protected entity = Resource;

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<Resource>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [items, total] = await this.repository.findAndCount({
      where: { technologyId },
      skip,
      take,
      order: { title: query.order === 'asc' ? 'ASC' : 'DESC' },
    });
    return { items, total, page: query.page, limit: query.limit };
  }
}
