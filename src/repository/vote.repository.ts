import { VoteEntity } from '@data/entity/vote.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(VoteEntity)
export class VoteRepository extends Repository<VoteEntity>{
  async getAverageVoteByUserId(postId: string) {
    return await this
      .createQueryBuilder('votes')
      .select('votes.postId', 'postId')
      .addSelect('AVG(votes.point)', 'averageVote')
      .addSelect('COUNT(votes.userId)','total')
      .where('votes.postId = :postId', { postId: postId })
      .groupBy('votes.postId')
      .getRawOne();
  }
}
