import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { OTPModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module'; // Import EmailModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
         secret: 'Mykey',
  signOptions: { expiresIn: '1h' },
      }),
    }),
    OTPModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService ],
  exports: [JwtModule, AuthService], // ✅ EXPORT JwtModule
})
export class AuthModule {}
