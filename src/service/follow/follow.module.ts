
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from './follow.service';
import { FollowRepository } from '@repository/follow.repository';
import { UserRepository } from '@repository/user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([FollowRepository,UserRepository])],
  providers: [FollowService],
  exports: [FollowService],
})

export class FollowModule { }
