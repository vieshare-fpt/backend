import { BankService } from "./bank.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BankRepository } from "@repository/bank.repository";


@Module(
    {
        imports: [TypeOrmModule.forFeature([BankRepository])],
        providers: [BankService],
        exports: [BankService]
    }
)

export class BankModule {}