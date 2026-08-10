import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { UserStreak } from '../entities/user-streak.entity';

export class UserStreakRepository {
  private get repository(): Repository<UserStreak> {
    return AppDataSource.getRepository(UserStreak);
  }

  async findByUserId(userId: string): Promise<UserStreak | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async create(userId: string): Promise<UserStreak> {
    const streak = this.repository.create({ userId });
    return this.repository.save(streak);
  }

  async update(userId: string, data: Partial<UserStreak>): Promise<void> {
    await this.repository.update({ userId }, data);
  }
}
