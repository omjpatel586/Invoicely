import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import express from 'express';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { JwtHelperService } from '../../helper/utils/jwt.helper';
import { User } from '../database/models/user.model';

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  public readonly NODE_ENV: string;
  public readonly JWT_SECRET_KEY: string;
  public readonly REACT_APP_URL: string;
  public readonly REACT_LOCAL_URL: string;
  public readonly JWT_EXPIRY: number; // default 1 day
  public readonly isProduction: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {
    this.NODE_ENV = this.configService.get('NODE_ENV') || 'development';
    this.JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY')?.toString();
    this.JWT_EXPIRY = +this.configService.get('JWT_EXPIRES_IN');
    this.REACT_APP_URL = this.configService.get('REACT_APP_URL')?.toString();
    this.REACT_LOCAL_URL = this.configService
      .get('REACT_LOCAL_URL')
      ?.toString();

    this.isProduction = this.NODE_ENV === 'production';
  }

  async googleLogin(accessToken: string, res: express.Response) {
    if (!accessToken) {
      throw new BadRequestException('Access token is required');
    }

    const { data: googleUser } = await firstValueFrom(
      this.httpService.get<GoogleUserInfo>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );

    if (!googleUser?.email) {
      throw new BadRequestException('Google login failed');
    }

    const email = googleUser.email;
    const firstName =
      googleUser.given_name ||
      googleUser.name?.split(' ')[0] ||
      email.split('@')[0];
    const lastName =
      googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';
    const picture = googleUser.picture || '';

    const user = await this.userModel.findOne({ $or: [{ email }, { id: googleUser.sub }] });

    const response: Partial<User> = {};

    if (user) {
      user.google = googleUser;
      user.firstName = user.firstName || firstName;
      user.lastName = user.lastName || lastName;
      user.profile = user.profile || picture;
      await user.save();
      response._id = user._id;
      response.firstName = user.firstName;
      response.lastName = user.lastName;
      response.email = user.email;
      response.profile = user.profile;
    } else {
      const newUser = new this.userModel({
        firstName,
        lastName,
        email,
        profile: picture,
        google: googleUser,
      });
      await newUser.save();
      response._id = newUser._id;
      response.firstName = newUser.firstName;
      response.lastName = newUser.lastName;
      response.email = newUser.email;
      response.profile = newUser.profile;
    }

    const newAuthToken = JwtHelperService.generateToken(
      {
        _id: response._id,
        email: response.email,
        createdAt: response.createdAt as Date,
      },
      this.JWT_SECRET_KEY,
      this.JWT_EXPIRY
    );

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Google Login Successful',
      data: { ...response, authToken: newAuthToken },
    });
  }

  async logOut(res: express.Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Logout Successful',
    });
  }
}
