import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { BonusFormulaService } from "@service/bonusFormula/bonusFormula.service";
import { CommonService } from "@service/common/common.service";
import { BonusStatisticService } from "./bonusStatistic.service";

@Module(
  {
    imports: [TypeOrmModule.forFeature([BonusStatisticReposiotry,PostRepository,BonusFormulaReposiotry,UserRepository,WalletRepository])],
    providers: [BonusStatisticService,BonusFormulaService,CommonService],
    exports: [BonusStatisticService]
  }
)
export class BonusStatisticModule { }
