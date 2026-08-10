import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository';
import { UserProfileRepository } from '../../repositories/user-profile.repository';
import { UserStreakRepository } from '../../repositories/user-streak.repository';
import { ConflictError, UnauthorizedError } from '../../errors/app.errors';
import { hashPassword, comparePassword } from '../../utils/password';
import {
  createTokenPayload,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  TokenPair,
} from '../../utils/jwt';
import { RegisterDto, LoginDto } from '../../validators/schemas';
import { UserRole } from '../../enums';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userStreakRepository: UserStreakRepository,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: SafeUser; tokens: TokenPair }> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('E-mail já cadastrado');

    const hashedPassword = await hashPassword(dto.password);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    await this.userProfileRepository.create(user.id);
    await this.userStreakRepository.create(user.id);

    const tokens = await this.generateTokens(user);
    return { user: this.toSafeUser(user), tokens };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser; tokens: TokenPair }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedError('Credenciais inválidas');

    const valid = await comparePassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedError('Credenciais inválidas');

    const tokens = await this.generateTokens(user);
    return { user: this.toSafeUser(user), tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let decoded: { sub: string; jti: string };
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Token de atualização inválido');
    }

    const stored = await this.refreshTokenRepository.findValidById(decoded.jti);
    if (!stored || stored.userId !== decoded.sub) {
      throw new UnauthorizedError('Token de atualização inválido');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Token de atualização expirado');
    }

    const tokenHash = hashToken(refreshToken);
    if (stored.tokenHash !== tokenHash) {
      throw new UnauthorizedError('Token de atualização inválido');
    }

    await this.refreshTokenRepository.revoke(stored.id);

    const user = await this.userRepository.findById(decoded.sub);
    if (!user) throw new UnauthorizedError('Usuário não encontrado');

    return this.generateTokens(user);
  }

  async getProfile(userId: string): Promise<SafeUser & { profile: unknown; streak: unknown }> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('Usuário não encontrado');

    const profile = await this.userProfileRepository.findByUserId(userId);
    const streak = await this.userStreakRepository.findByUserId(userId);

    return {
      ...this.toSafeUser(user),
      profile: profile ?? { totalXp: 0, learningPathId: null },
      streak: streak ?? { currentStreak: 0, longestStreak: 0 },
    };
  }

  private async generateTokens(user: { id: string; email: string; role: UserRole }): Promise<TokenPair> {
    const payload = createTokenPayload(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const refreshRecord = await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: '',
      expiresAt,
    });

    const refreshToken = signRefreshToken(user.id, refreshRecord.id);
    await this.refreshTokenRepository.updateTokenHash(refreshRecord.id, hashToken(refreshToken));

    return {
      accessToken: signAccessToken(payload),
      refreshToken,
    };
  }

  private toSafeUser(user: { id: string; name: string; email: string; role: UserRole; createdAt?: Date }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
};
