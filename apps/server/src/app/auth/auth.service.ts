import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import express from 'express';
import { Model } from 'mongoose';
import { JwtHelperService } from '../../helper/utils/jwt.helper';
import { User } from '../database/models/user.model';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  public readonly NODE_ENV: string;
  public readonly JWT_SECRET_KEY: string;
  public readonly REACT_APP_URL: string;
  public readonly REACT_LOCAL_URL: string;
  public readonly JWT_EXPIRY: number; // default 1 day
  public readonly isProduction: boolean;

  constructor(
    private readonly firebaseService: FirebaseService,
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

  async googleLogin(idToken: string, res: express.Response) {
    // Verify the Google ID token sent from frontend
    const decodedToken = await this.firebaseService.firebaseApp
      .auth()
      .verifyIdToken(idToken);

    if (!decodedToken) {
      throw new BadRequestException('Token verification failed');
    }

    const email = decodedToken.email;
    const name = decodedToken.name;
    const picture = decodedToken.picture;

    const user = await this.userModel.findOne({ email });

    const response: Partial<User> = {};

    if (user) {
      user.google = decodedToken;
      await user.save();
      response._id = user._id.toString();
      response.firstName = user.firstName;
      response.lastName = user.lastName;
      response.email = user.email;
      response.profile = user.profile;
    } else {
      const newUser = new this.userModel({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join('') || '',
        email,
        profile: picture,
        google: decodedToken,
      });
      await newUser.save();
      response._id = newUser._id.toString();
      response.firstName = newUser.firstName;
      response.lastName = newUser.lastName;
      response.email = newUser.email;
      response.profile = newUser.profile;
    }

    const newAuthToken = JwtHelperService.generateToken(
      {
        _id: response._id.toString() as string,
        email: response.email,
        createdAt: response.createdAt as Date,
      },
      this.JWT_SECRET_KEY,
      this.JWT_EXPIRY
    );

    res.cookie('invoicelyAppAuthToken', newAuthToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Google Login Successful',
      data: response,
    });
  }

  async logOut(res: express.Response) {
    res.clearCookie('invoicelyAppAuthToken', {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      path: '/',
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Logout Successful',
    });
  }
}
