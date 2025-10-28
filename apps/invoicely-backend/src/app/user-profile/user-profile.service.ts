import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/models/user.model';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User profile fetched successfully',
      data: user,
    };
  }
}
