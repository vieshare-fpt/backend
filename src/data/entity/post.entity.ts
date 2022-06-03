import { StatusPost } from "@constant/status-post.enum"
import { TypePost } from "@constant/types-post.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "@data/entity/user.entity";
import { CommentEntity } from "./comment.entity";
import { CategoryEntity } from "./category.entity";
import { HistoryEntity } from "./history.entity";
import { VoteEntity } from "./vote.entity";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'nvarchar', length: 255 })
  title: string

  @Column({ name: 'categoryId' })
  categoryId: string;

  @ManyToOne(
    () => CategoryEntity, (categoryEntity) => categoryEntity.posts)
  @JoinColumn({ name: 'categoryId' })
  category: Promise<CategoryEntity>;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  @JoinColumn({ name: 'authorId' })
  author: Promise<UserEntity>;

  @Column({ name: 'authorId' })
  authorId: string;

  @CreateDateColumn({ name: 'publishDate' })
  publishDate: Date;

  @UpdateDateColumn({ name: 'lastUpdated' })
  lastUpdated: Date;

  @Column({ name: 'views', default: 0 })
  views: number;

  @Column({ name: 'status', type: 'enum', enum: StatusPost, default: StatusPost.Publish, nullable: false })
  status: StatusPost;

  @Column({ name: 'postType', type: 'enum', enum: TypePost, default: TypePost.Free, nullable: false })
  type: TypePost;

  @OneToMany(
    () => CommentEntity,
    (commentEntity) => commentEntity.post
  )
  comments: Promise<CommentEntity[]>

  @OneToMany(
    () => VoteEntity,
    (voteEntity) => voteEntity.post
  )
  votes: Promise<VoteEntity[]>

  @OneToMany(
    () => HistoryEntity,
    (historyEntity) => historyEntity.post
  )
  history: Promise<HistoryEntity[]>;
}
