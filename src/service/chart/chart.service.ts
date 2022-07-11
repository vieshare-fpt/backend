import { Injectable } from "@nestjs/common";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";



@Injectable()
export class ChartService {
  constructor(
    private historyRepository: HistoryRepository,
    private commentRepository: CommentRepository,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private bonusStatisticReposiotry: BonusStatisticReposiotry
  ) { }
  async getAdminTotal() {

  }
}
