import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers.authorization;
    if (!headers) {
      return next();
    }
    const token = headers.split(' ')[1];
    if (!token) {
      return next();
    }
    const parsedToken = this.jwtService.decode(token);
    req.currentUser = parsedToken;

    next();
  }
}
