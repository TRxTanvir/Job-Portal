import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'unverified' })
  accountStatus: 'verified' | 'unverified';

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  extraCareer: string;

  @Column({ nullable: true })
  profilePic: string;
 @Column({ type: 'varchar', nullable: true, default: null })
  resumeUrl: string;
    // --- 3. ADD THIS PROPERTY AT THE BOTTOM OF THE CLASS ---
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}