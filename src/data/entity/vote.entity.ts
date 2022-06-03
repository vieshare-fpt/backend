import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";

@Entity('votes')
export class VoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.votes)
  @JoinColumn({ name: 'postId' })
  post: Promise<PostEntity>

  @Column({ name: 'postId', type: 'uuid' })
  postId: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.votes)
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'point' })
  @Length(0, 5)
  point: number;

  @CreateDateColumn({ name: 'publishDate' })
  publishDate: Date;


  @UpdateDateColumn({ name: 'lastUpdateDate' })
  lastUpdateDate: Date;

}
