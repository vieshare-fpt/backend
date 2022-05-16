import { User } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    PUBLISH = 'PUBLISH',
    PENDING = 'PENDING',
    HIDDEN = 'HIDDEN',
    REMOVED = 'REMOVED'
}

@Entity({ name: 'post' })
export class Post {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'title', type: 'nvarchar', length: 255 })
    title: string

    @Column({ name: 'subject' })
    subjectId: number

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

    @Column({ name: 'status', type: 'enum', enum: Status, default: Status.PUBLISH, nullable: false })
    status: Status;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'ownerId' })
    owner: User


}
