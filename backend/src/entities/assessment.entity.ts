import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Technology } from './technology.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'technology_id' })
  technologyId!: string;

  @Column({ type: 'int' })
  score!: number;

  @Column({ type: 'text' })
  feedback!: string;

  @Column({ name: 'mastered_competencies', type: 'jsonb', default: [] })
  masteredCompetencies!: string[];

  @Column({ name: 'weak_competencies', type: 'jsonb', default: [] })
  weakCompetencies!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Technology, (tech) => tech.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;
}
