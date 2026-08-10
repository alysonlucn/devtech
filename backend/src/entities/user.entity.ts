import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserRole } from '../enums';
import { RefreshToken } from './refresh-token.entity';
import { UserProfile } from './user-profile.entity';
import { UserStreak } from './user-streak.entity';
import { UserTechnologyProgress } from './user-technology-progress.entity';
import { UserProject } from './user-project.entity';
import { Assessment } from './assessment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile!: UserProfile;

  @OneToOne(() => UserStreak, (streak) => streak.user)
  streak!: UserStreak;

  @OneToMany(() => UserTechnologyProgress, (progress) => progress.user)
  technologyProgress!: UserTechnologyProgress[];

  @OneToMany(() => UserProject, (project) => project.user)
  projects!: UserProject[];

  @OneToMany(() => Assessment, (assessment) => assessment.user)
  assessments!: Assessment[];
}
