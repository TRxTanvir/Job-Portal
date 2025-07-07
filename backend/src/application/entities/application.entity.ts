import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Job } from '../../job/entities/job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column()
  resumeUrl: string; // We will store the path/filename of the uploaded resume

  @CreateDateColumn()
  appliedAt: Date;

  // --- Relationships ---

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;
}