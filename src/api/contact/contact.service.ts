import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContactDto, EmailVolunteers } from './dto/contact.dto';
import { transporter } from 'src/helpers/nodemailer.helper';
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import https from 'https';
import config from 'src/api/config';
import { PrismaService } from 'nestjs-prisma';

const { LIBERA_EMAIL_ACCOUNT, MOOSEND_API_KEY, MOOSEND_EMAIL_LIST_ID } = config;

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async sendContactForm(contactDto: ContactDto) {
    const template = fs.readFileSync(
      path.join(__dirname, '../../../src/helpers/email-templates/contactEmailTemplate.ejs'),
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
      path.join(__dirname, '../../../src/helpers/email-templates/volunteerContactEmailTemplate.ejs'),
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

  async subscribeToNewsletter(email: string) {
    const options = {
      hostname: 'api.moosend.com',
      path: `/v3/subscribers/${MOOSEND_EMAIL_LIST_ID}/subscribe.json?apikey=${MOOSEND_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const data = JSON.stringify({ Email: email });

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          reject(new HttpException('Failed to subscribe to the newsletter', HttpStatus.INTERNAL_SERVER_ERROR));
        }
      });

      req.on('error', (error) => {
        console.error(error);
        reject(new HttpException('Failed to subscribe to the newsletter', HttpStatus.INTERNAL_SERVER_ERROR));
      });

      req.write(data);
      req.end();
    });
  }
}
