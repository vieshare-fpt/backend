import { CategoryEntity } from "src/models/categories/entities/category.entity";
import { CommentEntity } from "src/models/comments/entities/comment.entity";
import { HistoryEntity } from "src/models/history/entities/history.entity";
import { IncomeStatisticEntity } from "src/models/income-statistics/entities/income-statistic.entity";
import { ReactEntity } from "src/models/reacts/entities/react.entity";
import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum PostStatus {
    PUBLISH = 'PUBLISH',
    PENDING = 'PENDING',
    HIDDEN = 'HIDDEN',
    REMOVED = 'REMOVED'
}

export enum PostType {
    PREMIUM = 'PREMIUM',
    FREE = 'FREE'
}

@Entity({ name: 'post' })
export class PostEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'title', type: 'nvarchar', length: 255 })
    title: string

    @Column({ name: 'categoryId' })
    categoryId: number

    @Column({ name: 'content', type: 'text' })
    content: string

    @Column({ name: 'ownerId' })
    ownerId: number

    @Column({ name: 'publishDate', type: 'datetime' })
    publishDate: Date

    @Column({ name: 'lastUpdated', type: 'datetime' })
    lastUpdated: Date

    @Column({ name: 'views' })
    views: number

    @Column({ name: 'status', type: 'enum', enum: PostStatus, default: PostStatus.PUBLISH, nullable: false })
    status: PostStatus;


    @Column({ name: 'postType', type: 'enum', enum: PostType, default: PostType.FREE, nullable: false })
    postType: PostType;


    @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
    @JoinColumn({ name: 'ownerId' })
    owner: Promise<UserEntity>;

    @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.posts)
    @JoinColumn({ name: 'categoryId' })
    category: Promise<CategoryEntity>;

    @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.post)
    comments?: Promise<CommentEntity[]>

    @OneToMany(() => ReactEntity, (reactEntity) => reactEntity.post)
    reactions?: Promise<ReactEntity[]>

    @OneToMany(() => IncomeStatisticEntity, (incomeStatisticEntity) => incomeStatisticEntity.post)
    incomeStatistics?: Promise<IncomeStatisticEntity[]>

    @OneToMany(() => HistoryEntity, (historyEntity) => historyEntity.posts)
    history?: Promise<ReactEntity[]>
}
