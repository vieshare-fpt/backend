
import { Invoice } from "src/models/invoices/entities/invoice.entity";
import { Post } from "src/models/posts/entities/post.entity";
import { Token } from "src/models/tokens/entities/token.entity";
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
export class User {

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


    @OneToMany(() => Post, (post) => post.owner)
    posts?: Promise<Post[]>;

    @OneToMany(() => Invoice, (invoice) => invoice.user)
    invoices?: Promise<Invoice[]>;

    @OneToOne(()=>Token,(token)=>token.user)
    token?: Promise<Token>;
}
