// in src/job/job.controller.ts

import { Controller, Get, Post, Query,ParseIntPipe,Param } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // This endpoint will populate your database with demo jobs.
  // You will only need to call this once.
  @Post('seed')
  seedDemoJobs() {
    return this.jobService.createDemoJobs();
  }

  // This is the main endpoint for your Next.js page to fetch all jobs.
  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  // You can use this for a search feature later!
  // e.g., /jobs/search?q=developer
  @Get('search')
  searchJobs(@Query('q') keyword: string) {
    return this.jobService.searchJobs(keyword);
  }
   @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }


}