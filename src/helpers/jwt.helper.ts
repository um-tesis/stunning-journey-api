import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import config from '../config/config';
import { UnauthorizedError } from '../utils/errors';

const { JWT_PRIVATE_KEY, JWT_EXPIRE_TIME } = config;

export const encode = (id: number) => {
  const secret = JWT_PRIVATE_KEY as jwt.Secret;
  const expiresAt = DateTime.local().plus({ seconds: +JWT_EXPIRE_TIME }).toISO();
  const claims = {
    id,
    expiresAt,
  };

  return jwt.sign(claims, secret, {
    expiresIn: JWT_EXPIRE_TIME,
  });
};

export const decode = (token: string) => {
  const secret = JWT_PRIVATE_KEY as jwt.Secret;
  try {
    return jwt.verify(token, secret);
  } catch (error: any) {
    throw new UnauthorizedError('Invalid token');
  }
};
