import { Role } from '@constant/role.enum';
import { Gender } from '@constant/user-gender.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TokenEntity } from '@data/entity/token.entity';

import { CommentEntity } from './comment.entity';
import { HistoryEntity } from './history.entity';
import { PostEntity } from './post.entity';
import { FollowEntity } from './follow.entity';
import { SubscriptionEntity } from './subscription.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })

  dob: string;

  @Column('enum', { enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array' })
  roles: Role[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ nullable: true, default: false })
  isDefaultPassword: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: Promise<TokenEntity[]>;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: Promise<PostEntity[]>;

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
  comments: Promise<CommentEntity[]>

  @OneToMany(
    () => HistoryEntity,
    (historyEntity) => historyEntity.user
  )
  history: Promise<HistoryEntity[]>;

  @OneToMany(
    () => FollowEntity,
    (followEntity) => followEntity.userID
  )
  user?: Promise<FollowEntity[]>;

  @OneToMany(
    () => FollowEntity,
    (followEntity) => followEntity.userID
  )
  follower?: Promise<FollowEntity[]>;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity) => subscriptionEntity.userID
  )
  subscription?: Promise<SubscriptionEntity[]>;
}
