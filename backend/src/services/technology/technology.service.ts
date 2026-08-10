import { TechnologyRepository } from '../../repositories/technology.repository';
import { ConflictError } from '../../errors/app.errors';
import { slugify } from '../../utils/slugify';
import { PaginatedResult, PaginationQuery } from '../../utils/pagination';
import { Technology } from '../../entities/technology.entity';
import { TechnologyCategory } from '../../enums';

export class TechnologyService {
  constructor(private readonly technologyRepository: TechnologyRepository) {}

  async findAll(
    query: PaginationQuery & { category?: TechnologyCategory },
  ): Promise<PaginatedResult<Technology>> {
    return this.technologyRepository.findAllPaginated(query);
  }

  async findById(id: string): Promise<Technology> {
    const tech = await this.technologyRepository.findWithRelations(id);
    if (!tech) {
      return this.technologyRepository.findByIdOrFail(id);
    }
    return tech;
  }

  async create(data: {
    name: string;
    slug?: string;
    description: string;
    whyLearn: string;
    whenLearn: string;
    estimatedTime: number;
    difficulty: Technology['difficulty'];
    order: number;
    category: TechnologyCategory;
  }): Promise<Technology> {
    const slug = data.slug ?? slugify(data.name);
    const existing = await this.technologyRepository.findBySlug(slug);
    if (existing) throw new ConflictError('Slug da tecnologia já existe');
    return this.technologyRepository.create({ ...data, slug });
  }

  async update(id: string, data: Partial<Technology>): Promise<Technology> {
    if (data.slug) {
      const existing = await this.technologyRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ConflictError('Slug já em uso');
    }
    return this.technologyRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.technologyRepository.delete(id);
  }
}
