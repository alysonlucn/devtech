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
import { ProjectStatus } from '../enums';
import { User } from './user.entity';
import { ProjectSuggestion } from './project-suggestion.entity';

@Entity('user_projects')
@Unique(['userId', 'projectId'])
export class UserProject {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.NOT_STARTED })
  status!: ProjectStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => ProjectSuggestion, (project) => project.userProjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectSuggestion;
}
