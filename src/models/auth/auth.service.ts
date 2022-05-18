import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokensService } from '../tokens/tokens.service';
import { UserEntity } from '../users/entities/user.entity';
import { AuthTokenDto } from './dto/auth-token.dto';


@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokensService,
    private userService: UsersService,
  ) { }

  async isUserExist(username: string): Promise<boolean> {
    const user = await this.userService.findUser(username);
    if (user !== null) {
      return true;
    } else {
      return false;
    }
  }


  async hashPasswrod(password: string): Promise<string> {
    const saltOrRounds = 12;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  async validateUser(username: string, password: string): Promise<UserEntity | null> {
    const user = await this.userService.findUser(username);
    if (!user) return null

    const check = await this.comparePassword(password, user.hashPassword);
    if (!check) return null;


    const { hashPassword, ...result } = user;
    return result;

  }

  async register(user: CreateUserDto): Promise<any> {
    const isUserExist = await this.isUserExist(user.username);

    if (isUserExist) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { password, ...payload } = user;
    payload.hashPassword = await this.hashPasswrod(password);
    return this.userService.create(payload)
  }

  async login(user: UserEntity, agent: string): Promise<AuthTokenDto> {

    return {
      access_token: await this.tokenService.newAccessToken(user),
      refresh_token: await this.tokenService.newRefeshToken({
        userId: user.id,
        agent: agent
      })
    };
  }

  async logout(user: UserEntity, agent: string): Promise<Boolean> {
    return this.tokenService.removeRefreshToken(user,agent);
  }
  async profile(id: number): Promise<any> {
    return await this.userService.findOne(id);
  }

  async refeshToken(tokens: AuthTokenDto, UserAgent: string) {
    return await this.tokenService.renewAuthTokens(tokens, UserAgent);
  }
}
