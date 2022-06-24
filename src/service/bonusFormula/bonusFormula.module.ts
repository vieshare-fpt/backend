import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { CommonService } from "@service/common/common.service";
import { BonusFormulaService } from "./bonusFormula.service";

@Module(
  {
    imports: [TypeOrmModule.forFeature([BonusFormulaReposiotry])],
    providers: [BonusFormulaService, CommonService],
    exports: [BonusFormulaService]
  }
)
export class BonusFormulaModule { }
