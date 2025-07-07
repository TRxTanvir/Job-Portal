// in src/job/job.service.ts

import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job } from './entities/job.entity';
import { Test } from '@nestjs/testing';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  // --- ADD THIS METHOD ---
  async findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }
  // -----------------------
async searchAndFindAll(options: { keyword?: string; location?: string }): Promise<Job[]> {
    const { keyword, location } = options;

    const queryBuilder = this.jobRepository.createQueryBuilder('job');

    // --- THIS IS THE UPDATED LOGIC FOR KEYWORD SEARCH ---
    if (keyword) {
      // In PostgreSQL, `\y` represents a word boundary (the start or end of a word).
      // The pattern `\y{word}\y` ensures we match the whole word only.
      // We need to escape the backslash for it to be a valid string in JavaScript, so it becomes `\\y`.
      const wholeWordKeyword = `\\y${keyword}\\y`;

      // `~*` is the operator for a case-insensitive regular expression match in PostgreSQL.
      queryBuilder.andWhere(
        '(job.title ~* :keywordRegex OR job.description ~* :keywordRegex OR job.company ~* :keywordRegex)',
        { keywordRegex: wholeWordKeyword },
      );
    }
    // ----------------------------------------------------

    if (location) {
      // Location search can remain a partial match, as users often expect this.
      queryBuilder.andWhere('job.location ILIKE :location', { location: `\y{word}\y` });
    }
    
    return queryBuilder.getMany();
  }
  async createDemoJobs() {
    const jobs = [
        { title: 'Frontend Developer', description: 'React/Next.js expert', company: 'Tech Corp', location: 'Dhaka' },
        { title: 'Backend Developer', description: 'Node/NestJS developer', company: 'Innovate Ltd', location: 'New York' },
        { title: 'Full Stack Engineer', description: 'MERN stack developer', company: 'Startup Inc', location: 'San Francisco' },
        { title: 'DevOps Engineer', description: 'CI/CD & AWS expert', company: 'CloudOps', location: 'Dhaka' },
    ];
    for (const job of jobs) {
      const exists = await this.jobRepository.findOne({ where: { title: job.title } });
      if (!exists) {
        const newJob = this.jobRepository.create(job);
        await this.jobRepository.save(newJob);
      }
    }
    return { message: 'Demo jobs created successfully' };
  }

  async searchJobs(keyword: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: [
        
        { title: ILike(`%${keyword}%`) },
        { description: ILike(`%${keyword}%`) },
        { company: ILike(`%${keyword}%`) },
      ],
    });
  }
  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });

    if (!job) {
      // If no job is found with that ID, throw a "Not Found" error
      throw new NotFoundException (`Job with ID #${id} not found`);
    }

    return job;
  }
}
