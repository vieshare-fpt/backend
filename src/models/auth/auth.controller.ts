import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.gaurd';


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
  @Post('login')
  async login(@Request() request): Promise<any> {
    console.log(request)
    if (!request.user.id) return new UnauthorizedException();
    return this.authService.login(request.user, request.get('user-agent'));
  }


  @Post('logout')
  async logout(@Request() request): Promise<any> {
    if (!request.user.id) return new UnauthorizedException();
    return this.authService.logout(request.user, request.get('user-agent'));
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Request() request): Promise<any> {
    const user = await this.authService.profile(request.user.id);
    const { hashPassword, ...result } = user;
    return result;
  }


  @Post('refresh')
  async refreshTokens(@Request() request): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const refreshToken = request?.get('refresh_token').trim();
        const UserAgent = request?.get('User-Agent').trim();
        const accessToken = request?.get('authorization')?.replace('Bearer', '').trim();
        if (!refreshToken && !UserAgent && !accessToken) {
          reject(new HttpException(
            { message: 'Refresh Tokens falid,refresh_token or authorization or User-Agent are null' },
            HttpStatus.BAD_REQUEST,
          ));
        }
        resolve(await this.authService.refeshToken(
          {
            access_token: accessToken,
            refresh_token: refreshToken
          },
          UserAgent))

      } catch (error) {
        reject(new HttpException(
          { message: 'Refresh Tokens falid, missing refresh_token or authorization or User-Agent' },
          HttpStatus.BAD_REQUEST,
        ));
      }

    })
  }
}
