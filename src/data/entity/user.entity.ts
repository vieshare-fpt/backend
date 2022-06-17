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
import { WalletEntity } from './wallet.entity';
import { SubscriptionEntity } from './subscription.entity';
import { VoteEntity } from './vote.entity';
import { CoverLetterEntity } from './cover-letter.entity';

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

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array', nullable: true })
  roles: Role[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ nullable: true, default: false })
  isDefaultPassword: boolean;


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
    (followEntity) => followEntity.user
  )
  user: Promise<FollowEntity[]>;

  @OneToMany(
    () => FollowEntity,
    (followEntity) => followEntity.user
  )
  follow: Promise<FollowEntity[]>;

  @OneToOne(
    () => WalletEntity,
    (wallet) => wallet.user,
  )
  wallet: Promise<WalletEntity>;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity) => subscriptionEntity.user
  )
  subcription: Promise<SubscriptionEntity[]>

  @OneToMany(
    () => VoteEntity,
    (voteEntity) => voteEntity.user
  )
  votes: Promise<VoteEntity[]>

  @OneToMany(
    () => CoverLetterEntity,
    (coverLetterEntity) => coverLetterEntity.user
  )
  coverLetters: Promise<CoverLetterEntity[]>
}
