import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Patch,
  HttpStatus,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Request } from 'express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto'; // Using one consistent DTO
import { RequestTokenDto } from './dto/requestToken.dto';
import { OTPType } from 'src/otp/type/otpType';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // NOTE: The main '/register' endpoint is in your AuthController.
  // This controller handles user-specific actions after they are logged in.

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    // This endpoint correctly gets the logged-in user's profile
    const userId = req.user.id;
    return this.userService.getUserProfile(userId);
  }

  // MERGED AND CORRECTED: This single endpoint now handles both
  // updating text data AND optionally uploading a new profile picture.
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profilePic', { // 'profilePic' is the field name for the file
      storage: diskStorage({
        destination: './uploads', // IMPORTANT: Make sure this 'uploads' folder exists
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      // Optional: Add file validation
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  async updateProfile(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto, // Use the correct DTO
    @UploadedFile() file?: Express.Multer.File, // The file is optional
  ) {
    const userId = (request.user as any).id;

    // If a file was uploaded, add its filename to the DTO
    if (file) {
      updateUserDto.profilePic = file.filename;
    }

    const updatedUser = await this.userService.updateProfile(userId, updateUserDto);
    return { 
      message: 'Profile updated successfully',
      user: updatedUser 
  };
}

  // NOTE: These next two endpoints are related to auth. For better organization in a large
  // project, you might move them to the AuthController in the future. For now, they can stay.

  @Post('request-otp')
  async requestOTP(@Body() dto: RequestTokenDto) {
    const { email } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // This re-uses the email sending logic from UserService
    await this.userService.emailVerification(user, OTPType.OTP);
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP sent successfully. Please check your email.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: RequestTokenDto) {
    const { email } = forgotDto;
    const user = await this.userService.findByEmail(email);
    // Note: To prevent attackers from checking which emails exist, we don't throw an error here.
    if (user) {
      await this.userService.emailVerification(user, OTPType.RESET_LINK);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'If an account with this email exists, a password reset link has been sent.',
    };
  }
  
  // --- THIS IS THE NEW ENDPOINT FOR CV UPLOADS ---
  @UseGuards(JwtAuthGuard)
  @Patch('resume')
  @UseInterceptors(
    FileInterceptor('resume', { // Field name must be 'resume'
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          // Prepend userId to filename for easy association
          const filename = `${(req.user as any).id}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Filter for PDF and Word documents
        if (file.mimetype.match(/\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file type. Only PDF, DOC, or DOCX are allowed.'), false);
        }
      },
    }),
  )
  async uploadResume(
    @Req() request,
    // Add validation pipes for the uploaded file
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB file size limit
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    // We don't need to check if file exists, the ParseFilePipe does it for us.
    const userId = request.user.id;
    return this.userService.updateResume(userId, file.filename);
  }
}