import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import config from '../config/config';
import { UnauthorizedError } from '../utils/errors';

const { JWT_PRIVATE_KEY, JWT_EXPIRE_TIME } = config;

export const encode = (id: number) => {
  const secret = JWT_PRIVATE_KEY as jwt.Secret;
  const jwtSeconds = JWT_EXPIRE_TIME;
  const expiresAt = DateTime.local().plus({ seconds: +jwtSeconds }).toISO();
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
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error: any) {
    throw new UnauthorizedError('Invalid token');
  }
};
