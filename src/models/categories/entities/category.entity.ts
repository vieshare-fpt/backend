import { Post } from "src/models/posts/entities/post.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @OneToMany(()=>Post,(post)=>post.category)
    posts?:Post[]

}
