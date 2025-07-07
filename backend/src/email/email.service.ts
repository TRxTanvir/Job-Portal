import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from 'src/email/dto/email.dto';
// This code should be in your EmailService

 // ... other imports

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // This is where Nodemailer connects to Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Should be smtp.gmail.com
      port: parseInt(process.env.EMAIL_PORT, 10), // Should be 587
      secure: process.env.EMAIL_SECURE === 'true', // false for port 587
      auth: {
        user: process.env.EMAIL_USER, // your trxtech746@gmail.com
        pass: process.env.EMAIL_PASSWORD, // <-- This MUST be EMAIL_PASSWORD
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

 
emailTransport() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: 'trxtech746@gmail.com',
      pass: 'bnmk ytdt uqth ppzq', // Gmail App Password
    },
  });

  return transporter;
}

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: 'trxtech746@gmail.com',
      to: recipients,
      subject:" Otp For Registation",
      html: html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
  }
}
