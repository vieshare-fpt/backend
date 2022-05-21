import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import e from 'express';

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


  async findRefeshToken(refeshToken: string, agent: string): Promise<TokenEntity> {

    return await this.tokenRepository.findOne({
      where: {
        refreshToken: refeshToken,
        agent: agent,
        dateExpire: MoreThanOrEqual<Date>(new Date())
      }
    })
  }

  private newExpirateDate(): Date {
    const date = new Date();
    var minutesToAdd = 30;
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    return new Date(date.setDate(date.getDate() + tokenConstatns.refreshTokenExpire));
  }



  async renewTokens(tokens: AuthTokenDto, agent: string): Promise<AuthTokenDto> {
    let access_token = "";
    let refresh_token = tokens.refresh_token;

    const refreshTokenEntity = await this.findRefeshToken(refresh_token, agent)

    if (!refreshTokenEntity) {

      refresh_token = await this.renewRefreshToken(tokens.refresh_token, agent)
    }


    const newRefeshTokenEntity = await this.findRefeshToken(refresh_token, agent)

    access_token = await this.newAccessToken(await refreshTokenEntity.user);

    return {
      access_token: access_token,
      refresh_token: refresh_token
    };
  }

  private async renewRefreshToken(refreshToken: string, agent: string): Promise<string> {
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

    const date = this.newExpirateDate();

    const newRefreshToken = uuid4()
    const affected = await this.tokenRepository.update({ refreshToken: refreshTokenEntity.refreshToken }, {
      refreshToken: newRefreshToken,
      dateExpire: date
    })
      .then(data => data.affected)
      .catch(err => { throw new BadRequestException(); })

    if (!affected) {
      throw new ConflictException();
    }

    return newRefreshToken;

  }


  async newAccessToken(user: UserEntity): Promise<string> {
    const { hashPassword, ...data } = user;
    return await this.jwtService.sign(data)
  }

  async newRefeshToken(createTokenDto: CreateTokenDto): Promise<string> {
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
