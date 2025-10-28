import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import express from 'express';
import { SecurityGuard } from '../guards/auth.guard';
import { UserProfileService } from './user-profile.service';

@Controller('user')
@UseGuards(SecurityGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('profile')
  async getUserProfile(@Req() req: express.Request) {
    return this.userProfileService.getUserProfile(
      req.headers.user._id.toString()
    );
  }
}
