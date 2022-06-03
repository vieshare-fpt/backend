import { PackageOrderBy } from "@constant/package-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { PackageEntity } from "@data/entity/package.entity";
import { EntityRepository, In, Repository } from "typeorm";

@EntityRepository(PackageEntity)
export class PackageRepository extends Repository<PackageEntity>{
  async getPackges(skip?: number, take?: number, isActive?: Boolean): Promise<PackageEntity[]> {

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

  async getPackgesOrderBy(orderBy: PackageOrderBy, sort: Sort, skip?: number, take?: number, isActive?: Boolean): Promise<PackageEntity[]> {
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
