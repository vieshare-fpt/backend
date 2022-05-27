import { FollowEntity } from "@data/entity/follow.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity>{

    async getFollows(skip?: number, take?: number): Promise<FollowEntity[]> {
        const follows = await this.find({skip: skip || null, take: take || null});
        return follows;
    }

    async countFollows(userID: string): Promise<number> {
        if(userID) return await this.count({where:{id: userID}});
    }
}