import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { ContactFormDto } from './dto/contact-form.dto';

@Injectable()
export class SupportService {
  // The constructor expects EmailService and ConfigService to be available
  // which we set up in the support.module.ts
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // This is the missing function
  async handleContactForm(contactFormDto: ContactFormDto) {
    const { name, email, subject, message } = contactFormDto;

    // Get your email address from the .env file
    const ownerEmail = this.configService.get('WEBSITE_OWNER_EMAIL');

    const emailSubjectToOwner = `New Contact Form Message: ${subject}`;

    // Format the email that you will receive
    const emailBodyToOwner = `
      <h1>New Message from Job Portal Contact Form</h1>
      <p>You have received a new message from a website visitor.</p>
      <hr>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>From Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message}</p>
    `;

    // Use the existing EmailService to send the email
    await this.emailService.sendEmail({
      recipients: [ownerEmail],
      subject: emailSubjectToOwner,
      html: emailBodyToOwner,
    });

    return { success: true, message: 'Your message has been sent successfully!' };
  }
}