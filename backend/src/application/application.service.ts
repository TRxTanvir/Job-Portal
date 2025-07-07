import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  // The function signature is now updated to accept 3 arguments
  async create(
    userId: number,
    jobId: number,
    details: { coverLetter: string; resumeUrl: string },
  ): Promise<Application> {
    
    const newApplication = this.applicationRepository.create({
      ...details,
      user: { id: userId },
      job: { id: jobId },
    });

    return this.applicationRepository.save(newApplication);
  }
}