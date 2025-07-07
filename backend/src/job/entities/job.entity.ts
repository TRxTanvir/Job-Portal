// src/job/entities/job.entity.ts
import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  company: string;

@Column({ type: 'varchar', nullable: true })
  location: string;
  
  @Column({ default: true })
  isActive: boolean;
 
  

   @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}