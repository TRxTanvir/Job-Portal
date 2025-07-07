// In src/job/job.module.ts
import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Application } from '../application/entities/application.entity'; // <-- Import Application

@Module({
  // Add the imports array if it doesn't exist
  imports: [
    TypeOrmModule.forFeature([Job, Application]) // <-- Add Application here
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}