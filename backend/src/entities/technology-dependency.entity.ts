import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Technology } from './technology.entity';

@Entity('technology_dependencies')
export class TechnologyDependency {
  @PrimaryColumn({ name: 'technology_id' })
  technologyId!: string;

  @PrimaryColumn({ name: 'prerequisite_technology_id' })
  prerequisiteTechnologyId!: string;

  @ManyToOne(() => Technology, (tech) => tech.dependencies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;

  @ManyToOne(() => Technology, (tech) => tech.dependentTechnologies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prerequisite_technology_id' })
  prerequisiteTechnology!: Technology;
}
