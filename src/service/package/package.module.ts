import { PackageEntity } from "@data/entity/package.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackageRepository } from "@repository/package.repository";
import { CommonService } from "@service/commom/common.service";
import { PackageService } from "./package.service";

@Module({
  imports: [TypeOrmModule.forFeature([PackageRepository])],
  providers: [PackageService, CommonService],
  exports: [PackageService]
})
export class PackageModule { }
