import { CommentEntity } from "src/models/comments/entities/comment.entity";
import { FollowEntity } from "src/models/follows/entities/follow.entity";
import { PostEntity } from "src/models/posts/entities/post.entity";
import { ReactionEntity } from "src/models/reactions/entities/reaction.entity";
import { SubscriptionEntity } from "src/models/subscriptions/entities/subscription.entity";
import { TokenEntity } from "src/models/tokens/entities/token.entity";
import { WalletEntity } from "src/models/wallets/entities/wallet.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


export enum Role {
    USER = 'USER',
    WRITER = 'WRITER',
    ADMIN = 'ADMIN'
}

export enum UserType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM'
}

export enum Status {
    ACTIVE = 'ACTIVE',
    UNACTIVE = 'UNACTIVE',
    REMOVED = 'REMOVED'
}

@Entity({ name: 'user' })
export class UserEntity {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'hashPassword' })
    hashPassword?: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'fullName', type: 'nvarchar', length: 255 })
    fullName: string;

    @Column({ name: 'role', type: 'enum', enum: Role, default: Role.USER, nullable: false })
    role: Role;

    @Column({ name: 'status', type: 'enum', enum: Status, default: Status.ACTIVE, nullable: false })
    status: Status;

    @Column({ name: 'userType', type: 'enum', enum: UserType, default: UserType.FREE, nullable: false })
    userType: UserType;


    @OneToMany(() => PostEntity, (postEntity) => postEntity.owner)
    posts?: Promise<PostEntity[]>;

    @OneToMany(() => SubscriptionEntity, (subscriptionEntity) => subscriptionEntity.user)
    premiumUsers?: Promise<SubscriptionEntity[]>;

    @OneToMany(() => TokenEntity, (tokenEntity) => tokenEntity.user)
    tokens?: Promise<TokenEntity[]>;

    @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
    comments?: Promise<Comment[]>

    @OneToOne(() => WalletEntity, (walletEntity) => walletEntity.user)
    wallet?: Promise<WalletEntity>

    @OneToMany(() => FollowEntity, (followEntity) => followEntity.users)
    followers?: Promise<UserEntity>;

    @OneToMany(() => FollowEntity, (followEntity) => followEntity.userFollowed)
    userFollows?: Promise<UserEntity[]>;

    @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.user)
    reactions?: Promise<ReactionEntity[]>

}
