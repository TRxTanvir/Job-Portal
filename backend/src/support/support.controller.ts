import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import { ContactFormDto } from './dto/contact-form.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('contact')
  @UsePipes(new ValidationPipe()) // This enables validation using the DTO
  async contactUs(@Body() contactFormDto: ContactFormDto) {
    return this.supportService.handleContactForm(contactFormDto);
  }
}