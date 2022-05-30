import { TransactionEntity } from "@data/entity/transaction.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
    
}