
import { EntityRepository, Repository } from "typeorm";
import { CoverLetterEntity } from "@data/entity/cover-letter.entity";

@EntityRepository(CoverLetterEntity)
export class CoverLetterRepository extends Repository<CoverLetterEntity> {

}
