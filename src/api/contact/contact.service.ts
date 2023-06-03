import { Injectable } from '@nestjs/common';
import { ContactDto, EmailVolunteers } from './dto/contact.dto';
import { transporter } from 'src/helpers/nodemailer.helper';
import * as fs from 'fs';
import * as ejs from 'ejs';
import path from 'path';
import config from 'src/api/config';
import { PrismaService } from 'nestjs-prisma';

const { LIBERA_EMAIL_ACCOUNT } = config;

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async sendContactForm(contactDto: ContactDto) {
    const template = fs.readFileSync(
      path.join(__dirname, '../../../../src/helpers/email-templates/contactEmailTemplate.ejs'),
      'utf-8',
    );

    const renderedTemplate = ejs.render(template, {
      name: contactDto.name,
      email: contactDto.email,
      message: contactDto.message,
      phone: contactDto.phone,
      company: contactDto.company,
    });

    // Set up the email message using the "Get in Touch" form data
    const message = {
      from: LIBERA_EMAIL_ACCOUNT,
      to: LIBERA_EMAIL_ACCOUNT,
      subject: 'Libera Get in Touch',
      html: renderedTemplate,
    };

    try {
      // Send the email using the nodemailer transporter
      await transporter.sendMail(message);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async emailVolunteers(emailVolunteersInput: EmailVolunteers) {
    const template = fs.readFileSync(
      path.join(__dirname, '../../../../src/helpers/email-templates/volunteerEmailTemplate.ejs'),
      'utf-8',
    );

    const volunteers = await this.prisma.projectUser.findMany({
      where: {
        projectId: emailVolunteersInput.projectId,
      },
      include: {
        user: true,
        project: true,
      },
    });

    for (const volunteer of volunteers) {
      const renderedTemplate = ejs.render(template, {
        volunteerName: volunteer.user.name,
        body: emailVolunteersInput.body,
        projectName: volunteer.project.name,
      });

      const message = {
        from: LIBERA_EMAIL_ACCOUNT,
        to: volunteer.user.email,
        subject: `LIBERA - ${volunteer.project.name} - ${emailVolunteersInput.subject}`,
        html: renderedTemplate,
      };

      try {
        await transporter.sendMail(message);
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return true;
  }
}
