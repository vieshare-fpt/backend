import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { PackageOrderBy } from "@constant/package-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { PackageEntity } from "@data/entity/package.entity";
import { NewPackageRequest } from "@data/request/new-package.request";
import { UpdatePackageRequest } from "@data/request/update-package.request";
import { PackageNotExistedException } from "@exception/package/package-not-existed.exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PackageRepository } from "@repository/package.repository";
import { CommonService } from "@service/commom/common.service";
import { type } from "os";

@Injectable()
export class PackageService {
  constructor(
    private packageRepository: PackageRepository,
    private commonService: CommonService<PackageEntity>
  ) { }

  // async getPackages() {
  //   return await this.packageRepository.find()
  // }
  async getPackages(perPage: number, page: number, isActive?: Boolean): Promise<HttpResponse<PackageEntity[]> | HttpPagingResponse<PackageEntity[]>> {
    page = page ? page : 1;
    const packagesResponse = await this.packageRepository.getPackges(perPage * (page - 1), perPage)
    const total = await this.packageRepository.count({});

    return this.commonService.getPagingResponse(packagesResponse, perPage, page, total)
  }

  async getPackagesOrderBy(orderBy: PackageOrderBy, sort: Sort, perPage: number, page: number, isActive?: Boolean) {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;

    if (!orderBy) {
      return this.getPackages(perPage, page, isActive);
    }

    orderBy = PackageOrderBy[orderBy];
    if (!orderBy) {
      throw new BadRequestException()
    }
    const packagesResponse = await this.packageRepository.getPackgesOrderBy(orderBy, sort, perPage * (page - 1), perPage, isActive);
    const total = await this.packageRepository.count()
    return this.commonService.getPagingResponse(packagesResponse, perPage, page, total)
  }

  async getPackage(id: string) {
    return await this.packageRepository.findOne(id)
  }

  async createNewPackage(newPackage: NewPackageRequest) {
    const packageEntity = new PackageEntity()
    packageEntity.name = newPackage.name;
    packageEntity.expirationTime = newPackage.expirationTime * 24 * 60 * 60 * 1000;
    packageEntity.price = newPackage.price;
    packageEntity.createDate = new Date().getTime()
    packageEntity.isActive = true;
    return await this.packageRepository.save(packageEntity)
  }


  async updatePackage(packageId: string, updatePackage: UpdatePackageRequest): Promise<PackageEntity> {
    const packageExisted = await this.packageRepository.findOne({ id: packageId })
    if (!packageExisted) {
      throw new PackageNotExistedException()
    }

    return (await this.packageRepository.update(
      {
        id: packageExisted.id
      },
      {
        name: updatePackage.name ? updatePackage.name : packageExisted.name,
        expirationTime: updatePackage.expirationTime ? updatePackage.expirationTime : packageExisted.expirationTime,
        price: updatePackage.price ? updatePackage.price : packageExisted.price,
        isActive: (typeof updatePackage.isActive == "boolean" ? updatePackage.isActive : packageExisted.isActive)
      }
    )).raw[0]

  }
}
