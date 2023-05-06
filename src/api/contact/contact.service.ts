import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import * as nodemailer from 'nodemailer';
import config from 'src/config/config';

const { NODEMAILER_PASSWORD, LIBERA_EMAIL_ACCOUNT } = config;

@Injectable()
export class ContactService {
  async sendContactForm(contactDto: ContactDto) {
    // with contactDto.name, contactDto.email, contactDto.message
    // Create a new nodemailer transporter with the appropriate SMTP credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: LIBERA_EMAIL_ACCOUNT,
        pass: NODEMAILER_PASSWORD,
      },
    });

    // Set up the email message using the "Get in Touch" form data
    const message = {
      from: LIBERA_EMAIL_ACCOUNT,
      to: LIBERA_EMAIL_ACCOUNT,
      subject: 'Libera Test',
      text: `
        Name: ${contactDto.name}
        Email: ${contactDto.email}
        Message: ${contactDto.message}
      `,
    };

    try {
      // Send the email using the nodemailer transporter
      await transporter.sendMail(message);
      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
