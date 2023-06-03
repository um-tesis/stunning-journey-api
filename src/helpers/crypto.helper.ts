import bcrypt from 'bcryptjs';
import { randomBytes, createCipheriv, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import config from '../api/config';

const { SALT_ROUNDS, ENCRYPTION_KEY } = config;

const SALT_TEXT = 'salt';
const KEY_LENGTH = 32;
export const compare = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);

export const hash = (password: string): string => {
  const salt = bcrypt.genSaltSync(+SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

export const encrypt = async (text: string): Promise<string> => {
  const iv = randomBytes(16);

  const key = (await promisify(scrypt)(ENCRYPTION_KEY, SALT_TEXT, KEY_LENGTH)) as Buffer;
  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = async (encrypted: string): Promise<string> => {
  const key = (await promisify(scrypt)(ENCRYPTION_KEY, SALT_TEXT, KEY_LENGTH)) as Buffer;
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};
