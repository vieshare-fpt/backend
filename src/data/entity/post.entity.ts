import { StatusPost } from "@constant/status-post.enum"
import { TypePost } from "@constant/types-post.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@data/entity/user.entity";

@Entity('posts')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title', type: 'nvarchar', length: 255 })
    title: string

    @Column({ name: 'categoryId' })
    categoryId: string

    @Column({ name: 'content', type: 'text' })
    content: string

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
    @JoinColumn({ name: 'authorId' })
    author: Promise<UserEntity>;
    @Column({ name: 'authorId' })
    authorId: string

    @Column({ name: 'publishDate', type: 'bigint' })
    publishDate: number

    @Column({ name: 'lastUpdated', type: 'bigint' })
    lastUpdated: number

    @Column({ name: 'views', default: 0 })
    views: number

    @Column({ name: 'status', type: 'enum', enum: StatusPost, default: StatusPost.Publish, nullable: false })
    status: StatusPost;

    @Column({ name: 'postType', type: 'enum', enum: TypePost, default: TypePost.Free, nullable: false })
    type: TypePost;
}