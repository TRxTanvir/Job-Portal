import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { OTPService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/type/otpType';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // Using 'userRepo' consistently
    private readonly otpService: OTPService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // Register user (as you had it)
  async register(dto: UserDto): Promise<void> {
    const { email, password } = dto;
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);
    return this.emailVerification(newUser, OTPType.OTP);
  }

  // Send OTP or reset link via email
  async emailVerification(user: User, otpType: OTPType) {
    const token = await this.otpService.generateToken(user, otpType);

    if (otpType === OTPType.OTP) {
      const emailDto = {
        recipients: [user.email],
        subject: 'Job-Portal OTP for verification',
        html: `Dear ${user.email}, <br>Your Job-Portal OTP code is: <strong>${token}</strong>.<br />Provide this otp to verify your account`,
      };
      return await this.emailService.sendEmail(emailDto);
    } else if (otpType === OTPType.RESET_LINK) {
      const resetUrlBase = this.configService.get('RESET_PASSWORD_URL');
      const resetLink = `${resetUrlBase}?token=${token}`;
      
      const emailDto = {
        recipients: [user.email],
        subject: 'Job-Portal Password Reset Link',
        html: `Click the given link to reset your Job-Portal password: <p><a href="${resetLink}">Reset Password</a></p>`,
      };
      return await this.emailService.sendEmail(emailDto);
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<User> {
    return await this.userRepo.findOne({ where: { email } });
  }

  // Get a user's profile
  async getUserProfile(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profilePicUrl = user.profilePic
      ? `http://localhost:4000/uploads/${user.profilePic}` // Assuming backend is on port 4000
      : null;

    const { password, ...profile } = user;
    return { ...profile, profilePicUrl };
  }
  
  // Update a user's profile
  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    // Correctly using 'userRepo' which was defined in the constructor
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Merge the new data from the DTO into the existing user entity
    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepo.save(user);

    delete updatedUser.password;
    return updatedUser;
  }
  // --- THIS IS THE NEW METHOD TO ADD ---
  async updateResume(userId: number, resumeFilename: string) {
    // This uses the .update() method for efficiency to update a single column
    await this.userRepo.update(userId, { resumeUrl: resumeFilename });

    return { message: 'Resume uploaded successfully.', resumeUrl: resumeFilename };
  }
}