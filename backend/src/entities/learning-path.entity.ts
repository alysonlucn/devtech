import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LearningPathTechnology } from './learning-path-technology.entity';

@Entity('learning_paths')
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(() => LearningPathTechnology, (lpt) => lpt.learningPath)
  technologies!: LearningPathTechnology[];
}
