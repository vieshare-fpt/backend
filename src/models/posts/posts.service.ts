import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) { }

  async create(createPostDto: CreatePostDto): Promise<any> {

    return await this.postRepository.save(
      {
        ...createPostDto,
        publishDate: new Date(),
        lastUpdated: new Date()
      })
      .then(data => {
        console.log(data);
        return data
      })
      .catch(err => {
        return {
          'status': 'Create falid',
          'sqlMessage': err?.sqlMessage
        }
      }
      );
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
