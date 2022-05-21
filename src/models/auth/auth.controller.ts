import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UnauthorizedException, BadRequestException, HttpException, HttpStatus, Header } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UserEntity, UserRole } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UserAgent } from './decorators/user-agent.decorator';
import { User } from './decorators/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';




@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserEntity, @UserAgent() userAgent: string): Promise<any> {
    if (!user.id) return new UnauthorizedException();
    return this.authService.login(user, userAgent);
  }


  @Post('logout')
  async logout(@Request() request): Promise<any> {
    if (!request.user.id) return new UnauthorizedException();
    return this.authService.logout(request.user, request.get('user-agent'));
  }


  @Get('profile')
  getProfile(@User() user) {
    return user;
  }

  @Public()
  @Post('refresh')
  async refreshTokens(@Request() request): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const refreshToken = request?.get('refresh_token').trim();
        const UserAgent = request?.get('User-Agent').trim();
        const accessToken = request?.get('authorization')?.replace('Bearer', '').trim();
        if (!refreshToken && !UserAgent && !accessToken) {
          reject(new HttpException(
            { status: HttpStatus.BAD_REQUEST, message: 'Refresh Tokens falid,refresh_token or authorization or User-Agent are null' },
            HttpStatus.BAD_REQUEST,
          ));
        }

        resolve(await this.authService.refeshAccessTokens(
          {
            access_token: accessToken,
            refresh_token: refreshToken
          },
          UserAgent))

      } catch (error) {
        reject(new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: 'Refresh Tokens falid' },
          HttpStatus.BAD_REQUEST,
        ));
      }

    })
  }

}
