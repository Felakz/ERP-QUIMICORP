import { Controller, Post, Body, Get, Headers, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return { authenticated: false };
    }
    const user = await this.authService.verifyToken(token);
    return { authenticated: true, user };
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
