import { Injectable } from '@nestjs/common';
import { compare, hash } from '../../helpers/crypto.helper';

@Injectable()
export class PasswordService {
  validatePassword(password: string, hashedPassword: string): boolean {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): string {
    return hash(password);
  }
}
