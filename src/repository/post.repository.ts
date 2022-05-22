import { PostEntity } from "@data/entity/post.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity>{
    
}