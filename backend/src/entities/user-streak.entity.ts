import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_streaks')
export class UserStreak {
  @PrimaryColumn({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'current_streak', default: 0 })
  currentStreak!: number;

  @Column({ name: 'longest_streak', default: 0 })
  longestStreak!: number;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  lastActivityDate!: string | null;

  @OneToOne(() => User, (user) => user.streak, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
