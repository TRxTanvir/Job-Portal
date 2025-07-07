import { OTPType } from 'src/otp/type/otpType'; // Adjust path if it's different
import { EmailService } from 'src/email/email.service'; // <-- ADD THIS LINE
 import { ResendOtpDto } from './dto/resend-otp.dto';


import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OTPService } from 'src/otp/otp.service';
import { ConflictException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly otpService: OTPService,
    private readonly emailService: EmailService, // <-- ADD THIS LINE

  ) {}

  async login(dto: loginDto) {
    try {
      const { email, password, otp } = dto;

      //check if user exists
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Email doesnt exist');
      }
// THIS IS THE CORRECTED CODE
if (user.accountStatus === 'unverified') {
  if (!otp) {
    // We now throw a proper exception, which sends a 401 error status
    throw new UnauthorizedException(
      'Your account is not verified.Please provide your otp to verify.',
    );
  } else {
    await this.verifyToken(user.id, otp);
  }
}
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      //check for account status
      if (user.accountStatus === 'unverified') {
        if (!otp) {
          return {
            message:
              'Your account is not verified.Please provide your otp to verify.',
          };
        } else {
          await this.verifyToken(user.id, otp);
        }
      }

      //generate a jwt token
      const payload = { id: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        userId: user.id,
        email: user.email,
      };
    } catch (err) {
      //handle unexpected error
      if (
        err instanceof UnauthorizedException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new BadRequestException('Login failed');
    }
  }

  async verifyToken(userId: number, token: string) {
    await this.otpService.validateOTP(userId, token);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //if otp is valid, account is verified
    user.accountStatus = 'verified';
    return await this.userRepository.save(user);
  }

  //service for reset password
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const userId = await this.otpService.validateResetPassword(token);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    //hash the new password and update the user
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return 'Password reset successfully';
  }

// In AuthService

// This new method goes inside the AuthService class
async resendOtp(resendOtpDto: ResendOtpDto) {
  const { email } = resendOtpDto;
  const user = await this.userRepository.findOne({ where: { email } });

  // To prevent hackers from checking which emails are registered,
  // we always return a generic success message.
  if (!user) {
    return { message: 'If an account with that email exists, a new OTP has been sent.' };
  }

  // If the user exists, we re-use our existing logic to send a new OTP.
  try {
    const otpCode = await this.otpService.generateToken(user, OTPType.OTP);
    const emailSubject = 'Your New Job Portal Verification Code';
    const emailBody = `<p>Your new verification code is: <strong>${otpCode}</strong></p>`;
    
    await this.emailService.sendEmail({
      recipients: [user.email],
      subject: emailSubject,
      html: emailBody,
    });
  } catch (error) {
    console.error('Failed to resend OTP:', error);
    // Even if it fails, we don't want to tell the user.
  }

  return { message: 'If an account with that email exists, a new OTP has been sent.' };
}
  //

  
async register(registerDto: RegisterDto) {
  const { email, password } = registerDto;
  const existingUser = await this.userRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new ConflictException('A user with this email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = this.userRepository.create({
    email,
    password: hashedPassword,
    accountStatus: 'unverified',
  });

  const savedUser = await this.userRepository.save(newUser);

  // In src/auth/auth.service.ts inside the register() method

// --- THIS IS THE FINAL, 100% CORRECT LOGIC ---
try {
  console.log(`User ${savedUser.email} saved. Now generating OTP and sending email...`);

  const otpCode = await this.otpService.generateToken(savedUser, OTPType.OTP);

  const emailSubject = 'Your Job Portal Verification Code';
  const emailBody = `<p>Welcome to the Job Portal!</p><p>Your verification code is: <strong>${otpCode}</strong></p>`;

  // Call your 'sendEmail' function matching the DTO exactly.
  // 'recipients' must be an array, so we wrap the email in [].
  await this.emailService.sendEmail({
    recipients: [savedUser.email], // <-- Correct property name and correct type (array)
    subject: emailSubject,
    html: emailBody,
  });

  console.log(`OTP email dispatch initiated for ${savedUser.email}.`);

} catch (error) {
    console.error('Failed to send OTP email after registration:', error);
}
 
// -----------------------------------------------------------
  delete savedUser.password;
  return savedUser;
  
}}