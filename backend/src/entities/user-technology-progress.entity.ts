import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ProgressStatus } from '../enums';
import { User } from './user.entity';
import { Technology } from './technology.entity';

@Entity('user_technology_progress')
@Unique(['userId', 'technologyId'])
export class UserTechnologyProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'technology_id' })
  technologyId!: string;

  @Column({ type: 'enum', enum: ProgressStatus, default: ProgressStatus.NOT_STARTED })
  status!: ProgressStatus;

  @Column({ type: 'int', nullable: true })
  score!: number | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.technologyProgress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Technology, (tech) => tech.userProgress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;
}
