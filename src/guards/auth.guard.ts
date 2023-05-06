import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { decode } from 'src/helpers/jwt.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.getArgs()[2].req;
    if (!req.headers.authorization) return false;

    const token: string = req.headers.authorization.split(' ')[1];
    if (!token) return false;

    try {
      req.claims = decode(token);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
