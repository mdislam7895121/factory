import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

@Controller('/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth/signup')
  signup(@Body() body: { email?: string; password?: string }) {
    return this.authService.signup(body ?? {});
  }

  @Post('/auth/login')
  login(@Body() body: { email?: string; password?: string }) {
    return this.authService.login(body ?? {});
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  me(@Req() req: AuthenticatedRequest) {
    return {
      ok: true,
      user: req.user,
    };
  }
}
