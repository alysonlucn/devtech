import { ResourceRepository } from '../../repositories/resource.repository';
import { TechnologyRepository } from '../../repositories/technology.repository';
import { PaginatedResult, PaginationQuery } from '../../utils/pagination';
import { Resource } from '../../entities/resource.entity';
import { ResourceType } from '../../enums';

export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async findByTechnology(technologyId: string, query: PaginationQuery): Promise<PaginatedResult<Resource>> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.resourceRepository.findByTechnology(technologyId, query);
  }

  async findById(id: string): Promise<Resource> {
    return this.resourceRepository.findByIdOrFail(id);
  }

  async create(technologyId: string, data: { title: string; type: ResourceType; url: string }): Promise<Resource> {
    await this.technologyRepository.findByIdOrFail(technologyId);
    return this.resourceRepository.create({ ...data, technologyId });
  }

  async update(id: string, data: Partial<{ title: string; type: ResourceType; url: string }>): Promise<Resource> {
    return this.resourceRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.resourceRepository.delete(id);
  }
}
