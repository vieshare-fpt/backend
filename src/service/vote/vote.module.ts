import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { VoteRepository } from "@repository/vote.repository";
import { VoteService } from "./vote.service";

@Module(
  {
    imports: [TypeOrmModule.forFeature([VoteRepository,UserRepository,PostRepository,SubscriptionRepository])],
    providers: [VoteService],
    exports: [VoteService]
  }
)
export class VoteModule { }
