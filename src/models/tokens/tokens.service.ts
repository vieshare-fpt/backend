import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants, tokenConstatns } from 'src/constrants';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenEntity } from './entities/token.entity';
import * as uuid4 from 'uuid4'
import { UsersService } from '../users/users.service';
import { AuthTokenDto } from '../auth/dto/auth-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokensService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>
  ) { }

  async findTokenByUserId(id: number): Promise<TokenEntity> {
    return await this.tokenRepository.findOne({
      where: {
        userId: id
      },
    });
  }
  async create(createTokenDto: CreateTokenDto) {
    return await this.tokenRepository.save(createTokenDto);
  }
  async update(updateTokenDto: UpdateTokenDto) {
    await this.tokenRepository.update({ refreshToken: updateTokenDto.refreshToken }, {
      userId: updateTokenDto.userId,
      refreshToken: updateTokenDto.refreshToken,
      agent: updateTokenDto.agent,
      dateExpire: updateTokenDto.dateExpire
    })
  }


  async findRefeshToken(refeshToken: string) {
    return await this.tokenRepository.findOne({
      where: {
        id: refeshToken,
        dateExpire: MoreThanOrEqual<Date>(new Date())
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

    createTokenDto.dateExpire = this.newExpirateDate();
    createTokenDto.refreshToken = uuid4();
    if (refreshTokenEntity) {
      await this.update(<UpdateTokenDto>createTokenDto)

      return await this.findTokenByUserId(createTokenDto.userId).then(data => data.refreshToken)
    }

    return await this.create(createTokenDto).then(data => data.refreshToken);
  }

  async renewAuthTokens(tokens: AuthTokenDto, agent: string): Promise<AuthTokenDto> {
    const refreshTokenEntity = await this.tokenRepository.findOne({
      where: {
        refreshToken: tokens.refresh_token,
        agent: agent,
        dateExpire: MoreThanOrEqual(new Date()),
      },
    });
    if (!refreshTokenEntity) {
      return this.issueRefreshToken(tokens.refresh_token, agent)
    }

  //  const user = await refreshTokenEntity.user;

    // return {
    //   access_token: await this.newAccessToken(user),
    //   refresh_token: tokens.refresh_token
    // };
  }
  private async issueRefreshToken(refreshToken: string, agent: string): Promise<AuthTokenDto> {
    const refreshTokenEntity = await this.tokenRepository.findOne({
      where: {
        refreshToken: refreshToken,
        agent: agent,
        dateExpire: LessThan(new Date()),
      }
    });
    if (!refreshTokenEntity) {
      throw new BadRequestException();
    }

    return this.renewTokens(refreshTokenEntity)
  }

  async newAccessToken(user: UserEntity): Promise<string> {
    const { hashPassword, ...data } = user;
    return await this.jwtService.sign(data)
  }


  private async renewTokens(refreshTokenEntity: TokenEntity): Promise<AuthTokenDto> {
    const date = this.newExpirateDate();
    const user = await this.userService.findOne(refreshTokenEntity.userId);
    this.tokenRepository.update({ refreshToken: refreshTokenEntity.refreshToken }, {
      refreshToken: uuid4(),
      dateExpire: date
    })

    const accessToken = await this.newAccessToken(user);
    const refreshToken = await (await this.tokenRepository.findOne({ where: { userId: refreshTokenEntity.userId } })).refreshToken;

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  async removeRefreshToken(user: UserEntity, agent: string): Promise<AuthTokenDto | any> {
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
