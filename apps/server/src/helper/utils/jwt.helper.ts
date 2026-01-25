import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';
import { User } from '../../app/database/models/user.model';

@Injectable()
export class JwtHelperService {
  static JWT_SECRET_KEY: string;

  constructor(private readonly configService: ConfigService) {
    JwtHelperService.JWT_SECRET_KEY = this.configService.get<string>(
      'JWT_SECRET_KEY'
    ) as string;
  }

  static extractToken(bearerToken: string): string | null {
    if (!bearerToken) return null;
    const parts = bearerToken.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  }

  static verifyToken(bearerToken: string): JwtPayload {
    const decoded = verify(bearerToken, JwtHelperService.JWT_SECRET_KEY);
    return decoded as JwtPayload;
  }

  static generateToken(
    payload: Pick<User, '_id' | 'email' | 'createdAt'>,
    secret: Secret,
    expiresIn: number
  ): string {
    return sign(payload, secret, { expiresIn });
  }
}
