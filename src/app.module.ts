
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from '@app/app.service';
import configuration from '@config/configuration';
import { AuthModule } from '@service/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@guard/auth.guard';
import { RolesGuard } from '@guard/role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig, DB_PATH_CONFIG } from '@config/database.config';
import { UserModule } from '@service/user/user.module';
import { AuthController } from '@api/auth.controller';
import { UserController } from '@api/user.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostController } from '@api/post.controller';
import { PostModule } from '@service/post/post.module';
import { CommentModule } from '@service/comment/comment.module';
import { CommentController } from '@api/comment.controller';
import { CategoryModule } from '@service/category/category.module';
import { CategoryController } from '@api/category.controller';
import { FollowModule } from '@service/follow/follow.module';
import { FollowController } from '@api/follow.controller';
import { HistoryModule } from '@service/history/history.module';
import { HistoryController } from '@api/history.controller';
import { PackageModule } from '@service/package/package.module';
import { PackageController } from '@api/package.controller';
import { Subscription } from 'rxjs';
import { SubscriptionModule } from '@service/subcription/subscription.module';
import { SubscriptionController } from '@api/subscription.controller';
import { WalletModule } from '@service/wallet/wallet.module';
import { WalletController } from '@api/wallet.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return configService.get<DatabaseConfig>(DB_PATH_CONFIG);
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    PostModule,
    CommentModule,
    FollowModule,
    HistoryModule,
    PackageModule,
    SubscriptionModule,
    WalletModule,
    WalletModule

  ],
  controllers: [
    AuthController,
    UserController,
    CategoryController,
    PostController,
    CommentController,
    FollowController,
    HistoryController,
    PackageController,
    SubscriptionController,
    WalletController

  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
