import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TechnologyDifficulty } from '../enums';
import { Technology } from './technology.entity';
import { UserProject } from './user-project.entity';

@Entity('project_suggestions')
export class ProjectSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'technology_id' })
  technologyId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: TechnologyDifficulty })
  difficulty!: TechnologyDifficulty;

  @ManyToOne(() => Technology, (tech) => tech.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;

  @OneToMany(() => UserProject, (up) => up.project)
  userProjects!: UserProject[];
}
