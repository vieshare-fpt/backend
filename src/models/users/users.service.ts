import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserType } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async create(user: any): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  findAll() {

    return `This action returns all users`;
  }

  async findOne(id: number): Promise<UserEntity | undefined> {

    return await this.userRepository.findOne(
      {
        where: {
          id: id
        }
      }
    )
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUser(username: string): Promise<UserEntity> {
    return this.userRepository.findOne(
      {
        where:
        {
          username: username
        }
      }
    );
  }


}
