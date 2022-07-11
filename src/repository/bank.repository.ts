import { BankEntity } from "@data/entity/bank.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(BankEntity)
export class BankRepository extends Repository<BankEntity> {



}