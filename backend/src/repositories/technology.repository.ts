import { FindOptionsWhere, ILike } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Technology } from '../entities/technology.entity';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';
import { TechnologyCategory } from '../enums';

export class TechnologyRepository extends BaseRepository<Technology> {
  protected entity = Technology;

  async findAllPaginated(
    query: PaginationQuery & { category?: TechnologyCategory },
  ): Promise<PaginatedResult<Technology>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const where: FindOptionsWhere<Technology> = {};
    if (query.search) where.name = ILike(`%${query.search}%`);
    if (query.category) where.category = query.category;

    const orderField = query.sort ?? 'order';
    const [items, total] = await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { [orderField]: query.order.toUpperCase() },
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async findBySlug(slug: string): Promise<Technology | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async findWithRelations(id: string): Promise<Technology | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['resources', 'projects', 'competencies', 'dependencies', 'dependencies.prerequisiteTechnology'],
    });
  }
}
