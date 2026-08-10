import { LearningPathRepository } from '../../repositories/learning-path.repository';
import { LearningPathTechnologyRepository } from '../../repositories/learning-path-technology.repository';
import { ConflictError } from '../../errors/app.errors';
import { slugify } from '../../utils/slugify';
import { PaginationQuery, PaginatedResult } from '../../utils/pagination';
import { LearningPath } from '../../entities/learning-path.entity';

export class LearningPathService {
  constructor(
    private readonly learningPathRepository: LearningPathRepository,
    private readonly lptRepository: LearningPathTechnologyRepository,
  ) {}

  async findAll(query: PaginationQuery): Promise<PaginatedResult<LearningPath>> {
    return this.learningPathRepository.findAllPaginated(query);
  }

  async findById(id: string): Promise<LearningPath> {
    return this.learningPathRepository.findByIdOrFail(id);
  }

  async create(data: { title: string; slug?: string; description: string }): Promise<LearningPath> {
    const slug = data.slug ?? slugify(data.title);
    const existing = await this.learningPathRepository.findBySlug(slug);
    if (existing) throw new ConflictError('Slug da trilha já existe');
    return this.learningPathRepository.create({ ...data, slug });
  }

  async update(id: string, data: Partial<{ title: string; slug: string; description: string }>): Promise<LearningPath> {
    if (data.slug) {
      const existing = await this.learningPathRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ConflictError('Slug já em uso');
    }
    return this.learningPathRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.learningPathRepository.delete(id);
  }

  async addTechnology(learningPathId: string, technologyId: string, order: number) {
    await this.learningPathRepository.findByIdOrFail(learningPathId);
    return this.lptRepository.create({ learningPathId, technologyId, order });
  }

  async removeTechnology(learningPathId: string, technologyId: string): Promise<void> {
    await this.lptRepository.delete(learningPathId, technologyId);
  }

  async getTechnologies(learningPathId: string) {
    return this.lptRepository.findByLearningPath(learningPathId);
  }
}
