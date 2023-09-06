import * as nodemailer from 'nodemailer';
import config from 'src/api/config';

const { NODEMAILER_PASSWORD, LIBERA_EMAIL_ACCOUNT } = config;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 25,
  host: 'smtp.gmail.com',
  auth: {
    user: LIBERA_EMAIL_ACCOUNT,
    pass: NODEMAILER_PASSWORD,
  },
});
