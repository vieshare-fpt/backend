import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constrants';
import { TokensService } from '../tokens/tokens.service';
import { Token } from '../tokens/entities/token.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }
    })
  ],

  controllers: [AuthController],
  providers: [AuthService, UsersService, TokensService]
})
export class AuthModule { }
