import { VoteEntity } from '@data/entity/vote.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(VoteEntity)
export class VoteRepository extends Repository<VoteEntity>{
  async getAverageVoteByPostId(postId: string) {
    const voteResponse = await this
      .createQueryBuilder('votes')
      .select('votes.postId', 'postId')
      .addSelect('AVG(votes.point)', 'averageVote')
      .addSelect('COUNT(votes.userId)', 'total')
      .where('votes.postId = :postId', { postId: postId })
      .groupBy('votes.postId')
      .getRawOne();
    if (!voteResponse) {
      return {
        postId,
        'averageVote': 0,
        'total': 0
      };
    }
    return voteResponse
  }

  async getVoteByPostIdAndUserId(userId: string, postId: string) {
    return await this.findOne(
      {
        where: {
          postId: postId,
          userId: userId
        }
      }
    )

  }
}
