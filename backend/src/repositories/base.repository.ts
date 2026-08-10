import { Repository, ObjectLiteral, FindOptionsWhere, DeepPartial } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { NotFoundError } from '../errors/app.errors';
import { PaginatedResult, PaginationQuery, getSkipTake } from '../utils/pagination';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected abstract entity: new () => T;

  protected get repository(): Repository<T> {
    return AppDataSource.getRepository(this.entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  async findByIdOrFail(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) throw new NotFoundError('Recurso não encontrado');
    return entity;
  }

  async findAll(query: PaginationQuery, where?: FindOptionsWhere<T>): Promise<PaginatedResult<T>> {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const orderField = query.sort ?? 'createdAt';
    const [items, total] = await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { [orderField]: query.order.toUpperCase() } as never,
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.findByIdOrFail(id);
    await this.repository.update(id, data as never);
    return this.findByIdOrFail(id);
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repository.delete(id);
  }
}
