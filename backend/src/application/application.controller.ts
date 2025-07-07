import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Body,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationService } from './application.service';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
    destination: './uploads/resumes', // <-- This folder
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async apply(
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
    @Body('jobId', ParseIntPipe) jobId: number,
    @Body('coverLetter') coverLetter: string,
  ) {
    if (!file) {
      throw new BadRequestException('Resume file is required.');
    }
    const userId = request.user.id;
    
    // This now correctly calls the updated service method with 3 arguments
    return this.applicationService.create(userId, jobId, {
      coverLetter: coverLetter,
      resumeUrl: file.path,
    });
  }
}