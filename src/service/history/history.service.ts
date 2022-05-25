/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '@repository/history.repository';
import { PostRepository } from '@repository/post.repository';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class HistoryService {
    constructor(
        private historyRepository: HistoryRepository,
        private postRepository: PostRepository,
        private userRepository: UserRepository
    ) { }


}
