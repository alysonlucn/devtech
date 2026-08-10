import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TechnologyDifficulty, TechnologyCategory } from '../enums';
import { TechnologyDependency } from './technology-dependency.entity';
import { Resource } from './resource.entity';
import { ProjectSuggestion } from './project-suggestion.entity';
import { Competency } from './competency.entity';
import { LearningPathTechnology } from './learning-path-technology.entity';
import { UserTechnologyProgress } from './user-technology-progress.entity';
import { Assessment } from './assessment.entity';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'why_learn', type: 'text' })
  whyLearn!: string;

  @Column({ name: 'when_learn', type: 'text' })
  whenLearn!: string;

  @Column({ name: 'estimated_time', type: 'int' })
  estimatedTime!: number;

  @Column({ type: 'enum', enum: TechnologyDifficulty })
  difficulty!: TechnologyDifficulty;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'enum', enum: TechnologyCategory })
  category!: TechnologyCategory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => TechnologyDependency, (dep) => dep.technology)
  dependencies!: TechnologyDependency[];

  @OneToMany(() => TechnologyDependency, (dep) => dep.prerequisiteTechnology)
  dependentTechnologies!: TechnologyDependency[];

  @OneToMany(() => Resource, (resource) => resource.technology)
  resources!: Resource[];

  @OneToMany(() => ProjectSuggestion, (project) => project.technology)
  projects!: ProjectSuggestion[];

  @OneToMany(() => Competency, (competency) => competency.technology)
  competencies!: Competency[];

  @OneToMany(() => LearningPathTechnology, (lpt) => lpt.technology)
  learningPaths!: LearningPathTechnology[];

  @OneToMany(() => UserTechnologyProgress, (progress) => progress.technology)
  userProgress!: UserTechnologyProgress[];

  @OneToMany(() => Assessment, (assessment) => assessment.technology)
  assessments!: Assessment[];
}
