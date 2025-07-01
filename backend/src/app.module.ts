import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { OTPModule } from './otp/otp.module';
import { OTP } from './otp/entities/otp.entity';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { ResumeModule } from './resume/resume.module';
import { UpdateDateColumn } from 'typeorm';
import { UpdateProfileDto } from './user/dto/update-profile.dto';
import { MulterModule } from '@nestjs/platform-express';
import { ApplicationModule } from './application/application.module'; 
import { SupportModule } from './support/support.module';


@Module({
  imports: [
    EmailModule,JobModule,SupportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME') || 'postgres',
    password: configService.get('DB_PASSWORD') || 'root',
    database: configService.get('DB_DATABASE') || 'AD',
    entities: [User, OTP],
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') !== 'production', // false in production
    retryAttempts: 5,
    retryDelay: 3000,
    logging: true, // helpful for debugging
 
  }),
  inject: [ConfigService],
}),
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    OTPModule,
    ApplicationModule,
    AuthModule,JobModule, ResumeModule,UpdateProfileDto, SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
