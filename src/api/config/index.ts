import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

const config = {
  PORT: process.env.SERVER_PORT,
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  SITE_URL_PROD: process.env.SITE_URL_PROD,
  SERVER_PORT: process.env.SERVER_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_URL_PROD: process.env.CLIENT_URL_PROD,
  NGROK_URL: process.env.NGROK_URL,

  DB_URL: process.env.DATABASE_URL,
  DB_NAME: process.env.DATABASE_NAME,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  SALT_ROUNDS: process.env.SALT_ROUNDS,

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  GRAPHQL_PLAYGROUND: process.env.GRAPHQL_PLAYGROUND,

  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  LIBERA_EMAIL_ACCOUNT: process.env.LIBERA_EMAIL_ACCOUNT,

  MOOSEND_API_KEY: process.env.MOOSEND_API_KEY,
  MOOSEND_EMAIL_LIST_ID: process.env.MOOSEND_EMAIL_LIST_ID,

  BADGR_USERNAME: process.env.BADGR_USERNAME,
  BADGR_PASSWORD: process.env.BADGR_PASSWORD,
  BADGR_ISSUER_ID: process.env.BADGR_ISSUER_ID,
  BADGR_BASIC_BADGE_ID: process.env.BADGR_BASIC_BADGE_ID,
  BADGR_BRONZE_BADGE_ID: process.env.BADGR_BRONZE_BADGE_ID,
  BADGR_SILVER_BADGE_ID: process.env.BADGR_SILVER_BADGE_ID,
  BADGR_GOLD_BADGE_ID: process.env.BADGR_GOLD_BADGE_ID,
  BADGR_API_URL: process.env.BADGR_API_URL,
};

if (require.main === module && process.env.NODE_ENV === 'development') {
  console.log('<<<<<< CONFIG >>>>>', config);
}

export default config;
