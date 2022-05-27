
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from './follow.service';
import { FollowRepository } from '@repository/follow.repository';
@Module({
  imports: [TypeOrmModule.forFeature([FollowRepository])],
  providers: [FollowService],
  exports: [FollowService],
})

export class FollowModule { }
