import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants, tokenConstatns } from 'src/constrants';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';
import * as uuid4 from 'uuid4'
import { UsersService } from '../users/users.service';
import { AuthTokenDto } from '../auth/dto/auth-token.dto';

@Injectable()
export class TokensService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) { }

  async findTokenByUserId(id: number): Promise<Token> {
    return await this.tokenRepository.findOne({
      where: {
        userId: id
      },
    });
  }
  async create(createTokenDto: CreateTokenDto) {
    return await this.tokenRepository.save(createTokenDto);
  }


  findRefeshToken(refeshToken: string) {
    return this.tokenRepository.findOne({
      where: {
        id: refeshToken,
        validUntil: MoreThanOrEqual<Date>(new Date())
      }
    })
  }

  private newExpirateDate(): Date {
    const date = new Date();
    return new Date(date.setDate(date.getDate() + tokenConstatns.accessTokenExpire));
  }

  async newRefeshToken(createTokenDto: CreateTokenDto) {
    const refreshTokenEntity = await this.findTokenByUserId(createTokenDto.userId)
    const date = this.newExpirateDate()
    if (refreshTokenEntity) {
      await this.tokenRepository.update(refreshTokenEntity.id, {
        id: uuid4(),
        agent: createTokenDto.agent,
        validUntil: date
      })

      return await this.findTokenByUserId(createTokenDto.userId).then(data => data.id)
    }
    return await this.create(
      {
        id: uuid4(),
        agent: createTokenDto.agent,
        userId: createTokenDto.userId,
        validUntil: date
      }
    ).then(data => {
      return data.id;
    });
  }

  async renewAuthTokens(tokens: AuthTokenDto, agent: string): Promise<AuthTokenDto> {
    const refreshTokenEntity = await this.tokenRepository.findOne({
      where: {
        id: tokens.refresh_token,
        agent: agent,
        validUntil: MoreThanOrEqual(new Date()),
      },
    });
    if (!refreshTokenEntity) {
      return this.issueRefreshToken(tokens.refresh_token, agent)
    }

    const user = await refreshTokenEntity.user;

    return {
      access_token: await this.newAccessToken(user),
      refresh_token: tokens.refresh_token
    };
  }
  private async issueRefreshToken(refreshToken: string, agent: string): Promise<AuthTokenDto> {
    const refreshTokenEntity = await this.tokenRepository.findOne({
      where: {
        id: refreshToken,
        agent: agent,
        validUntil: LessThan(new Date()),
      }
    });
    if (!refreshTokenEntity) {
      throw new BadRequestException();
    }

    return this.renewTokens(refreshTokenEntity)
  }

  async newAccessToken(user: User): Promise<string> {
    const { hashPassword, ...data } = user;
    return await this.jwtService.sign(data)
  }


  private async renewTokens(refreshTokenEntity: Token): Promise<AuthTokenDto> {
    const date = this.newExpirateDate();
    const user = await this.userService.findOne(refreshTokenEntity.userId);
    this.tokenRepository.update(refreshTokenEntity.id, {
      id: uuid4(),
      validUntil: date
    })

    const accessToken = await this.newAccessToken(user);
    const refreshToken = await (await this.tokenRepository.findOne({ where: { userId: refreshTokenEntity.userId } })).id;

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  async removeRefreshToken(user: User, agent: string): Promise<AuthTokenDto | any> {
    const update = await this.tokenRepository.delete({ userId: user.id, agent: agent });
    if (update.affected) {
      return {
        access_token: '',
        refresh_token: ''
      };
    }
    return new HttpException(
      { message: 'Logout failed' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
