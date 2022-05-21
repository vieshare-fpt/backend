import { PostEntity } from "src/models/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @OneToMany(() => PostEntity, (postEntity) => postEntity.category)
    posts?: PostEntity[]

}
