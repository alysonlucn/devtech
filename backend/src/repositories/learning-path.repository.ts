import { ILike } from 'typeorm';
import { BaseRepository } from './base.repository';
import { LearningPath } from '../entities/learning-path.entity';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';

export class LearningPathRepository extends BaseRepository<LearningPath> {
  protected entity = LearningPath;

  async findAllPaginated(query: PaginationQuery): Promise<PaginatedResult<LearningPath>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const where = query.search ? { title: ILike(`%${query.search}%`) } : {};
    const orderField = query.sort ?? 'title';
    const [items, total] = await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { [orderField]: query.order.toUpperCase() },
      relations: ['technologies', 'technologies.technology'],
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async findBySlug(slug: string): Promise<LearningPath | null> {
    return this.repository.findOne({
      where: { slug },
      relations: ['technologies', 'technologies.technology'],
    });
  }
}
