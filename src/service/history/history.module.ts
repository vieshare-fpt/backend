import { HistoryService } from './history.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryRepository } from '@repository/history.repository';
import { PostRepository } from '@repository/post.repository';
import { UserRepository } from '@repository/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository, PostRepository, HistoryRepository])],
    controllers: [HistoryService],
    providers: [HistoryService,],
})
export class HistoryModule { }
