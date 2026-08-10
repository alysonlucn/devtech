import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { UserProfile } from '../entities/user-profile.entity';

export class UserProfileRepository {
  private get repository(): Repository<UserProfile> {
    return AppDataSource.getRepository(UserProfile);
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['learningPath'],
    });
  }

  async create(userId: string): Promise<UserProfile> {
    const profile = this.repository.create({ userId, totalXp: 0 });
    return this.repository.save(profile);
  }

  async addXp(userId: string, xp: number): Promise<void> {
    await this.repository.increment({ userId }, 'totalXp', xp);
  }

  async setLearningPath(userId: string, learningPathId: string): Promise<void> {
    await this.repository.update({ userId }, { learningPathId });
  }
}
