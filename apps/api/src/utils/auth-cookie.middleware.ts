import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authCookie = req.cookies?.token;

    if (authCookie && req.headers['authorization'] === undefined) {
      // If the cookie exists, set the Authorization header
      req.headers['authorization'] = `Bearer ${authCookie}`;
    }
    next();
  }
}