import { HistoryService } from './history.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryRepository } from '@repository/history.repository';
import { UserRepository } from '@repository/user.repository';
import { PostRepository } from '@repository/post.repository';
import { PostModule } from '@service/post/post.module';


@Module({
  imports: [TypeOrmModule.forFeature([HistoryRepository, UserRepository, PostRepository])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule { }
