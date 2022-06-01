/*
https://docs.nestjs.com/providers#services
*/

import { HistoryEntity } from '@data/entity/history.entity';
import { PostNotExistedException } from '@exception/post/post-not-existed.exception';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '@repository/history.repository';
import { PostRepository } from '@repository/post.repository';
import { UserRepository } from '@repository/user.repository';


@Injectable()
export class HistoryService {
  constructor(
    private historyRepository: HistoryRepository,
    private userRepository: UserRepository,
    private postRepository: PostRepository
  ) { }


  async saveHistoryForUsers(postId: string, userId: string): Promise<HistoryEntity> {
    const post = await this.postRepository.findOne({ id: postId })
    if (!post) {
      throw new PostNotExistedException()
    }
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new UserNotExistedException();
    }
    const history = new HistoryEntity();
    history.userId = user.id;
    history.postId = post.id;
    history.lastDateRead = new Date();
    return this.historyRepository.save(history)
  }



  async getHistoryForUser(userId: string): Promise<HistoryEntity[]> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new UserNotExistedException();
    }
    const history = await this.historyRepository.find({
      where: {
        userId: userId
      },
      order: {
        lastDateRead: 'DESC'
      }
    })
    return history;
  }

}
