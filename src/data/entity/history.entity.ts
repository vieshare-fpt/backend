import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";



@Entity('history')
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.history
  )
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>

  @Column('userId')
  userId: string;

  @ManyToOne(
    () => PostEntity,
    (postEntity) => postEntity.history
  )
  @JoinColumn({ name: 'postId' })
  post: Promise<PostEntity>

  @Column('postId')
  postId: string;

  @Column({ name: 'lastDateRead', type: 'bigint' })
  lastDateRead: Date;


}
