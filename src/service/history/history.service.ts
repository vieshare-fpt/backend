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


  async saveHistoryForAnonymous(postId: string, agent: string): Promise<HistoryEntity> {
    const post = await this.postRepository.findOne({ id: postId })
    if (!post) {
      throw new PostNotExistedException()
    }
    const anonymous = await this.userRepository.findOneAnonymousUser()
    if (!anonymous) {
      this.userRepository.generateAnonymousUser();
      return this.saveHistoryForAnonymous(postId, agent);
    }
    const history = new HistoryEntity();
    history.userId = anonymous.id;
    history.agent = agent;
    history.postId = postId;
    history.lastDateRead = new Date().getTime();
    return this.historyRepository.save(history)
  }

  async saveHistoryForUsers(postId: string, userId: string): Promise<HistoryEntity> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new UserNotExistedException();
    }
    const history = new HistoryEntity();
    history.userId = user.id;
    history.postId = postId;
    history.lastDateRead = new Date().getTime();
    return this.historyRepository.save(history)
  }

  async getHistoryForAnonymus(agent: string): Promise<HistoryEntity[]> {
    const history = await this.historyRepository.find({
      where: {
        agent: agent
      },
      order: {
        lastDateRead: 'DESC'
      }
    })
    return history;
  }

  async getHistoryForUser(userId: string): Promise<HistoryEntity[]> {
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
