import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
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

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username);
    const check = await this.comparePassword(password, user.hashPassword);
    if (user && check) {
      const { hashPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: CreateUserDto): Promise<UserDto> {
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

  async login(user: any): Promise<any> {
    const result = await this.userService.findUser(user.username);
    const { hashPassword, ...payload } = result;

    return {
      token: this.jwtService.sign(payload)
    };
  }

  async profile (id : number): Promise<any>{
    return await this.userService.findOne(id);
  }
}
