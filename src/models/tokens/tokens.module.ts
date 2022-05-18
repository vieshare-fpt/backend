import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { jwtConstants } from 'src/constrants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }
    })
  ],
  controllers: [TokensController],
  providers: [TokensService, UsersService]
})
export class TokensModule { }
