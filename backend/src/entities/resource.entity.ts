import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResourceType } from '../enums';
import { Technology } from './technology.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'technology_id' })
  technologyId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'enum', enum: ResourceType })
  type!: ResourceType;

  @Column({ length: 2048 })
  url!: string;

  @ManyToOne(() => Technology, (tech) => tech.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology!: Technology;
}
