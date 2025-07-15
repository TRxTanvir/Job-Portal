import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from 'src/email/dto/email.dto';
// This code should be in your EmailService

 // ... other imports

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  // Example of your send mail function
  async sendVerificationEmail(userEmail: string, token: string) {
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`, // Sender address
      to: userEmail, // List of receivers
      subject: 'Welcome! Please Verify Your Email', // Subject line
      html: `
        <p>Welcome to Job Portal!</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `, // html body
    });

    console.log(`Verification email sent to ${userEmail}`);
  }

  // ... any other email functions

 
  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;

    const options: nodemailer.SendMailOptions = {
      from: '"Job Portal" <${process.env.EMAIL_USER}>',
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await this.transporter.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
      throw new Error('Failed to send email');
    }
  }
}
