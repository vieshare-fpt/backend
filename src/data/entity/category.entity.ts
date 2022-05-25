
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";



@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'categoryName', nullable: false })
    name: string;

    @Column({ default: false })
    isDelete: boolean;

    @OneToMany(
        () => PostEntity,
        (postEntity) => postEntity.category
    )
    post: Promise<PostEntity[]>;




}
