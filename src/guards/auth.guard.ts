import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { decode } from 'src/helpers/jwt.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('HERE', context.getArgs()[2].req.headers);
    if (!context.getArgs()[2].req.headers.authorization) return false;
    const token = context.getArgs()[2].req.headers.authorization.replace('Bearer ', '');
    if (!token) return false;
    else {
      try {
        const claims = decode(token as string);
        context.getArgs()[2].req.claims = claims;

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
}
