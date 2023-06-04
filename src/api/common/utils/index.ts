import config from '../../config';

const { CLIENT_URL, CLIENT_URL_PROD, NODE_ENV, SITE_URL_PROD, SITE_URL, SERVER_PORT } = config;

export const getClientUrl = (): string => {
  if (NODE_ENV === 'production') {
    return CLIENT_URL_PROD;
  }

  return CLIENT_URL;
};

export const getSiteUrl = (): string => {
  if (NODE_ENV === 'production') {
    return SITE_URL_PROD;
  }

  return SITE_URL.replace('${SERVER_PORT}', SERVER_PORT);
};
