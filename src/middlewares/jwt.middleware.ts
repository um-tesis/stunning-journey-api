import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { decode } from 'src/helpers/jwt.helper';

import apiResponses from '../utils/api-responses';
import { UnauthorizedError } from '../utils/errors';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  use(req: Request & { claims: any }, res: Response, next: NextFunction) {
    if (!req.headers.cookie) apiResponses.unauthorized(res, 'Expected token');
    const token = req.headers.cookie.replace('Authorization=Bearer', '');
    if (!token) apiResponses.unauthorized(res, 'Expected token');
    else {
      try {
        const claims = decode(token);
        req.claims = claims;
        next();
      } catch (error) {
        if (error instanceof UnauthorizedError) apiResponses.unauthorized(res, error.message);
      }
    }
  }
}
