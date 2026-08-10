import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { LearningPath } from './learning-path.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'learning_path_id', nullable: true })
  learningPathId!: string | null;

  @Column({ name: 'total_xp', default: 0 })
  totalXp!: number;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => LearningPath, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'learning_path_id' })
  learningPath!: LearningPath | null;
}
