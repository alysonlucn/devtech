import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LearningPath } from './learning-path.entity';
import { Technology } from './technology.entity';

@Entity('learning_path_technologies')
export class LearningPathTechnology {
  @PrimaryColumn({ name: 'learning_path_id' })
  learningPathId!: string;

  @PrimaryColumn({ name: 'technology_id' })
  technologyId!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => LearningPath, (lp) => lp.technologies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'learning_path_id' })
  learningPath!: LearningPath;

  @ManyToOne(() => Technology, (tech) => tech.learningPaths, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;
}
