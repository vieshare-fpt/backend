import { CommentEntity } from "src/models/comments/entities/comment.entity";
import { FollowEntity } from "src/models/follows/entities/follow.entity";
import { HistoryEntity } from "src/models/history/entities/history.entity";
import { PostEntity } from "src/models/posts/entities/post.entity";
import { ReactEntity } from "src/models/reacts/entities/react.entity";
import { SubscriptionEntity } from "src/models/subscriptions/entities/subscription.entity";
import { TokenEntity } from "src/models/tokens/entities/token.entity";
import { WalletEntity } from "src/models/wallets/entities/wallet.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


export enum UserRole {
    USER = 'USER',
    CREATOR = 'CREATOR',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN'
}

export enum UserType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM'
}

export enum UserStatus {
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

    @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.USER, nullable: false })
    role: UserRole;

    @Column({ name: 'status', type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE, nullable: false })
    status: UserStatus;

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

    @OneToMany(() => ReactEntity, (reactEntity) => reactEntity.user)
    reactions?: Promise<ReactEntity[]>

    @OneToMany(() => HistoryEntity, (historyEntity) => historyEntity.users)
    history?: Promise<ReactEntity[]>


}
