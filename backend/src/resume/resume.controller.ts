import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { join } from 'path';
import { Response } from 'express';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: join(process.cwd(), 'uploads/resumes'),
    }),
  )
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user?.id || 13; // Replace with real user ID logic
    const savedPath = await this.resumeService.saveResumePath(userId, file.path);
    return { message: 'Resume uploaded successfully', path: savedPath };
  }

  @Get(':userId')
  async getResume(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    const resumePath = await this.resumeService.getResumePath(userId);
    return res.sendFile(resumePath);
  }
}
