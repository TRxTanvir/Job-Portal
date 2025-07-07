import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OTPModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Application } from '../application/entities/application.entity'; // <-- Import Application

@Module({
  imports: [TypeOrmModule.forFeature([User]), OTPModule, EmailModule,AuthModule,Application],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
