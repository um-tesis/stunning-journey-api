import bcrypt from 'bcryptjs';
import config from 'src/api/config';

const { SALT_ROUNDS } = config;
export const compare = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);

export const hash = (password: string): string => {
  const salt = bcrypt.genSaltSync(+SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};
