
import { PostEntity } from "src/models/posts/entities/post.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('income-statistic')
export class IncomeStatisticEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'postId' })
    postId: number

    @Column({ name: 'lastCountReact' })
    lastCountReact: number

    @Column({ name: 'lastCountView' })
    lastCountViews: number

    @Column({ name: 'price', type: 'float' })
    price: number

    @Column({ name: 'dateForm', type: 'datetime' })
    dateFrom: Date

    @Column({ name: 'dateTo', type: 'datetime' })
    dateTo: Date

    @ManyToOne(() => PostEntity, (postEntity) => postEntity.incomeStatistics)
    @JoinColumn({ name: 'postId' })
    post: Promise<PostEntity>
}
