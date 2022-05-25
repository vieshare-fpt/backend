import { HistoryEntity } from "@data/entity/history.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity>{

}