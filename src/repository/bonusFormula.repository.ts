import { BonusFormulaOrderBy } from "@constant/bonus-formula-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { BonusFormulaEntity } from "@data/entity/bonus-formula.entity";
import { EntityRepository, In, Repository } from "typeorm";

@EntityRepository(BonusFormulaEntity)
export class BonusFormulaReposiotry extends Repository<BonusFormulaEntity> {

  async countIsActive(isActive?: Boolean) {
    return await this.count({

      where: {
        isActive: In((typeof isActive == "boolean" ? [isActive] : [true, false]))
      },

    })

  }
  async getPackges(skip?: number, take?: number, isActive?: Boolean): Promise<BonusFormulaEntity[]> {

    const packagesResponse = await this.find(
      {
        where: {
          isActive: In((typeof isActive == "boolean" ? [isActive] : [true, false]))
        },
        skip: skip || 0,
        take: take || null,

      }
    )
    return packagesResponse;
  }

  async getPackgesOrderBy(orderBy: BonusFormulaOrderBy, sort: Sort, skip?: number, take?: number, isActive?: Boolean): Promise<BonusFormulaEntity[]> {
    const packges = await this.find(
      {
        where: {
          isActive: In((typeof isActive == "boolean" ? [isActive] : [true, false]))
        },
        order: {
          [orderBy]: sort
        },
        skip: skip || 0,
        take: take || null
      })
    return packges;
  }
}
