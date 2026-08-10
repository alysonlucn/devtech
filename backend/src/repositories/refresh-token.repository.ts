import { Repository, IsNull } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { RefreshToken } from '../entities/refresh-token.entity';

export class RefreshTokenRepository {
  private get repository(): Repository<RefreshToken> {
    return AppDataSource.getRepository(RefreshToken);
  }

  async create(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = this.repository.create(data);
    return this.repository.save(token);
  }

  async findValidById(id: string): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: { id, revokedAt: IsNull() },
    });
  }

  async revoke(id: string): Promise<void> {
    await this.repository.update(id, { revokedAt: new Date() });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update({ userId, revokedAt: null as unknown as undefined }, { revokedAt: new Date() });
  }

  async updateTokenHash(id: string, tokenHash: string): Promise<void> {
    await this.repository.update(id, { tokenHash });
  }
}
