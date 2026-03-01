import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import express from 'express';
import { SecurityGuard } from '../guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login/google')
  async googleLogin(
    @Body('idToken') idToken: string,
    @Res() res: express.Response
  ) {
    return this.authService.googleLogin(idToken, res);
  }

  @Post('logout')
  @UseGuards(SecurityGuard)
  async logOut(@Res() res: express.Response) {
    return this.authService.logOut(res);
  }
}
