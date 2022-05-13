import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '129.150.41.100',
      port: 3306,
      username: 'admin',
      password: 'ut5TW2ShXsKZxkCd',
      database: 'vieshare',
      entities: [],
      synchronize: true,
      dropSchema: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
