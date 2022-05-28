import { FollowEntity } from "@data/entity/follow.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity>{

    async getFollows(userID: string, skip?: number, take?: number): Promise<FollowEntity[]> {
        const follows = await this.find(
            {
                where: {
                    userID: userID,
                },
                skip: skip || 0,
                take: take || null
            });

        return follows;
    }

    async countFollows(userID: string): Promise<number> {
        if (userID) return await this.count({ where: { id: userID } });
    }

    async checkValidFollows(userID: string): Promise<boolean> {
        const currentUser = await this.findOne(userID);
        if(currentUser) return false;
    }
}