import config from '../../config';

const { CLIENT_URL, CLIENT_URL_PROD, NODE_ENV, SITE_URL_PROD, SITE_URL, SERVER_PORT, NGROK_URL } = config;

export const getClientUrl = (): string => {
  if (NODE_ENV === 'production') return CLIENT_URL_PROD;

  return CLIENT_URL;
};

export const getSiteUrlOrNgrok = (ngrok = false): string => {
  if (NODE_ENV === 'production') return SITE_URL_PROD;
  if (ngrok) return NGROK_URL;

  return SITE_URL.replace('${SERVER_PORT}', SERVER_PORT);
};
