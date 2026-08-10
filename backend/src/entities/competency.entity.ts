import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Technology } from './technology.entity';

@Entity('competencies')
export class Competency {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'technology_id' })
  technologyId!: string;

  @Column({ length: 255 })
  title!: string;

  @ManyToOne(() => Technology, (tech) => tech.competencies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;
}
