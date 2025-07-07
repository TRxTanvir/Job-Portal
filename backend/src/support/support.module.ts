import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { EmailModule } from '../email/email.module'; // Import EmailModule

@Module({
  imports: [EmailModule], // Add EmailModule here
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}