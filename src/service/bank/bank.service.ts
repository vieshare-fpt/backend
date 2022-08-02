import { BankEntity } from "@data/entity/bank.entity";
import { Injectable } from "@nestjs/common";
import { BankRepository } from "@repository/bank.repository";




@Injectable()
export class BankService {
    constructor(
        private bankRepository: BankRepository,
    ) { }


    async getListBank(): Promise<BankEntity[]> {
        return await this.bankRepository.find();
    }

    async addNewbank(name: string): Promise<BankEntity> {
        const bank: BankEntity = new BankEntity();
        bank.name= name;
        return await this.bankRepository.save(bank);

    }
}