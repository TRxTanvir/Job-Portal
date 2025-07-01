import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
 import { ConflictException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ResendOtpDto } from './dto/resend-otp.dto'; // Import new DTO

 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
@Post('register')

async register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
  @Post('login')
  async login(@Body() dto: loginDto) {
    return this.authService.login(dto);
  }
// --- THIS IS THE MISSING ENDPOINT ---
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }
  // ------------------------------------
  @Post('reset-password')
  async resetPassword(
    @Body() { token, password }: { token: string; password: string },
  ) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() request) {
    return {
      message: 'Welcome to profile',
      user: request.user, //fetch user from request
    };
  }
}
