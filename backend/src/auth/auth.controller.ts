import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { LoginUserDTO } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: CreateUserDTO) {
    return this.authService.register(body);
  }

  @Get('/confirm-email')
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post("/login")
  async login(@Body() body: LoginUserDTO){
    return this.authService.login(body);
  }
}
