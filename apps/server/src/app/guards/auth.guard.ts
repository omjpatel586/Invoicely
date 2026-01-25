import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import express from 'express';
import { IncomingHttpHeaders } from 'http';
import { Model } from 'mongoose';
import { JwtHelperService } from '../../helper/utils/jwt.helper'; // your helper
import { User } from '../database/models/user.model';

declare module 'express' {
  interface Request {
    headers: IncomingHttpHeaders & {
      user: User;
    };
  }
}

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: express.Request = context.switchToHttp().getRequest();
    const token = req.cookies['invoicelyAppAuthToken'];

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const decoded = JwtHelperService.verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userModel.findOne({ _id: decoded._id }).lean();

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    req.headers.user = user as unknown as User; // attach user info to request
    return true;
  }
}
