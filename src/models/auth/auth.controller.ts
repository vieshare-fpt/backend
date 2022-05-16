import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.gaurd';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request): Promise<any> {
    return this.authService.login(request.body);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Request() request): Promise<any> {
    const user = await this.authService.profile(request.user.id);
    const { hashPassword, ...result } = user;
    return result;
  }
}
