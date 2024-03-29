import config from '../../config';

const {
  CLIENT_URL,
  CLIENT_URL_PROD,
  NODE_ENV,
  SITE_URL_PROD,
  SITE_URL,
  SERVER_PORT,
  NGROK_CLIENT_URL,
  NGROK_SITE_URL,
} = config;

export const getClientUrlOrNgrok = (ngrok = false): string => {
  if (NODE_ENV === 'production') return CLIENT_URL_PROD;
  if (ngrok) return NGROK_CLIENT_URL;

  return CLIENT_URL;
};

export const getSiteUrlOrNgrok = (ngrok = false): string => {
  if (NODE_ENV === 'production') return SITE_URL_PROD;
  if (ngrok) return NGROK_SITE_URL;

  return SITE_URL.replace('${SERVER_PORT}', SERVER_PORT);
};
