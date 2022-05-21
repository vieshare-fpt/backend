import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './models/users/users.module';
import { PostsModule } from './models/posts/posts.module';
import { AuthModule } from './models/auth/auth.module';
import { CategoriesModule } from './models/categories/categories.module';
import { TokensModule } from './models/tokens/tokens.module';
import { CommentsModule } from './models/comments/comments.module';
import { WalletsModule } from './models/wallets/wallets.module';
import { FollowsModule } from './models/follows/follows.module';
import { CategoryEntity } from './models/categories/entities/category.entity';
import { CommentEntity } from './models/comments/entities/comment.entity';
import { FollowEntity } from './models/follows/entities/follow.entity';
import { PostEntity } from './models/posts/entities/post.entity';
import { TokenEntity } from './models/tokens/entities/token.entity';
import { UserEntity } from './models/users/entities/user.entity';
import { WalletEntity } from './models/wallets/entities/wallet.entity';
import { SubscriptionsModule } from './models/subscriptions/subscriptions.module';
import { SubscriptionEntity } from './models/subscriptions/entities/subscription.entity';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ReactsModule } from './models/reacts/reacts.module';
import { ReactEntity } from './models/reacts/entities/react.entity';
import { IncomeStatisticsModule } from './models/income-statistics/income-statistics.module';
import { IncomeStatisticEntity } from './models/income-statistics/entities/income-statistic.entity';
import { HistoryModule } from './models/history/history.module';
import { HistoryEntity } from './models/history/entities/history.entity';
import { JwtGuard } from './models/auth/guards/jwt.guard';
import { RolesGuard } from './models/auth/guards/roles.guard';
import { LocalAuthGuard } from './models/auth/guards/local.guard';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '129.150.41.100',
    //   port: 3307,
    //   username: 'admin',
    //   password: 'ut5TW2ShXsKZxkCd',
    //   database: 'vieshare',
    //   entities: [User,Post,Invoice],
    //   synchronize: true,
    //   dropSchema: true
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: '12345',
      database: 'vieshare',
      // entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      entities: [UserEntity, PostEntity, CategoryEntity, TokenEntity, SubscriptionEntity, WalletEntity, FollowEntity, CommentEntity, ReactEntity, IncomeStatisticEntity, HistoryEntity],
      synchronize: true,
      dropSchema: true
    }),
    RouterModule.register([
      { path: 'api', module: UsersModule },
      { path: 'api', module: PostsModule },
      { path: 'api', module: CategoriesModule },
      { path: 'api', module: CommentsModule },
      { path: 'api', module: WalletsModule },
      { path: 'api', module: FollowsModule },
      { path: 'api', module: ReactsModule },
      { path: 'api', module: SubscriptionsModule },
      { path: 'api', module: TokensModule }
    ]),
    UsersModule,
    PostsModule,
    AuthModule,
    CategoriesModule,
    TokensModule,
    CommentsModule,
    WalletsModule,
    FollowsModule,
    ReactsModule,
    SubscriptionsModule,
    ReactsModule,
    IncomeStatisticsModule,
    HistoryModule

  ],
  controllers: [AppController],
  providers: [AppService
    ,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule { }
