import * as nodemailer from 'nodemailer';
import config from 'src/api/config';

const { NODEMAILER_PASSWORD, LIBERA_EMAIL_ACCOUNT } = config;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: LIBERA_EMAIL_ACCOUNT,
    pass: NODEMAILER_PASSWORD,
  },
});
