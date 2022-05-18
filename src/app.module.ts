import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './models/users/users.module';
import { PostsModule } from './models/posts/posts.module';
import { InvoicesModule } from './models/invoices/invoices.module';
import { User } from './models/users/entities/user.entity';
import { Post } from './models/posts/entities/post.entity';
import { Invoice } from './models/invoices/entities/invoice.entity';
import { AuthModule } from './models/auth/auth.module';
import { CategoriesModule } from './models/categories/categories.module';
import { Category } from './models/categories/entities/category.entity';
import { TokensModule } from './models/tokens/tokens.module';
import { Token } from './models/tokens/entities/token.entity';

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
      entities: [User,Post,Invoice,Category,Token],
      synchronize: true,
      dropSchema: true
    }),
    UsersModule,
    PostsModule,
    InvoicesModule,
    AuthModule,
    CategoriesModule,
    TokensModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
