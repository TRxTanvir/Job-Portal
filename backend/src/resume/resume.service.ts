import { Injectable, NotFoundException } from '@nestjs/common';
import { join, basename } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ResumeService {
  private readonly resumeFolder = join(process.cwd(), 'uploads/resumes');

  async saveResumePath(userId: number, filePath: string): Promise<string> {
    const userDir = join(this.resumeFolder, `${userId}`);
    await fs.mkdir(userDir, { recursive: true });

    const fileName = basename(filePath);
    const newPath = join(userDir, fileName);

    await fs.rename(filePath, newPath);
    return newPath;
  }

  async getResumePath(userId: number): Promise<string> {
    const userDir = join(this.resumeFolder, `${userId}`);

    try {
      const stats = await fs.stat(userDir);
      if (!stats.isDirectory()) {
        throw new NotFoundException('Resume directory not found.');
      }
    } catch {
      throw new NotFoundException('Resume directory not found.');
    }

    const files = await fs.readdir(userDir);
    if (!files.length) {
      throw new NotFoundException('No resume found.');
    }

    return join(userDir, files[0]); // returns the full absolute path
  }
}
