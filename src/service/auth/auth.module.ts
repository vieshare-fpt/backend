import { Module } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig, JWT_PATH_CONFIG } from '@config/jwt.config';
import { JwtStrategy } from '@service/auth/jwt.strategy';
import { CryptStrategy } from '@service/auth/crypt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repository/user.repository';
import { TokenRepository } from '@repository/token.repository';
import { UserService } from '@service/user/user.service';
import { WalletService } from '@service/wallet/wallet.service';
import { WalletRepository } from '@repository/wallet.repository';
import { TransactionRepository } from '@repository/transaction.repository';
import { CommonService } from '@service/common/common.service';
import { SubscriptionService } from '@service/subcription/subscription.service';
import { SubscriptionRepository } from '@repository/subscription.repository';
import { PackageRepository } from '@repository/package.repository';
import { FollowRepository } from '@repository/follow.repository';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<JwtConfig>(JWT_PATH_CONFIG),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserRepository, TokenRepository,WalletRepository,TransactionRepository,SubscriptionRepository,PackageRepository,FollowRepository])
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    CryptStrategy,
    UserService,
    WalletService,
    CommonService,
    SubscriptionService
  ],
  exports: [AuthService, CryptStrategy],
})
export class AuthModule {}
