import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { PackageOrderBy } from "@constant/package-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { PackageEntity } from "@data/entity/package.entity";
import { NewPackageRequest } from "@data/request/new-package.request";
import { PagingRequest } from "@data/request/paging.request";
import { UpdatePackageRequest } from "@data/request/update-package.request";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PackageService } from "@service/package/package.service";

@ApiTags('Package')
@Controller('api/packages')
export class PackageController {
  constructor(
    private packageService: PackageService
  ) { }



  @Public()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: PackageOrderBy, example: PackageOrderBy.price, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getPackagesIsActive(
    @Query('order_by') orderBy: PackageOrderBy,
    @Query('sort') sort: Sort,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<PackageEntity[]> | HttpPagingResponse<PackageEntity[]> | any> {
    const isActive = true;
    const packgesResponse = await this.packageService.getPackagesOrderBy(orderBy, sort, paging.per_page, paging.page, isActive)
    return packgesResponse
  }


  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: PackageOrderBy, example: PackageOrderBy.price, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getPackages(
    @Query('order_by') orderBy: PackageOrderBy,
    @Query('sort') sort: Sort,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<PackageEntity[]>> {
    const packgesResponse = await this.packageService.getPackagesOrderBy(orderBy, sort, paging.per_page, paging.page)
    return packgesResponse
  }

  @Public()
  @ApiParam({ name: 'id', example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4', required: false })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPackage(
    @Param('id') id: string,
  ): Promise<HttpResponse<PackageEntity>> {
    return HttpResponse.success(await this.packageService.getPackage(id))
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createNewPackage(
    @Body() newPackageRequest: NewPackageRequest
  ): Promise<HttpResponse<PackageEntity>> {
    const createNewPackage = await this.packageService.createNewPackage(newPackageRequest)
    return HttpResponse.success(createNewPackage);
  }

  @Public()
  @ApiParam({ name: 'id', example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4', required: true })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePackge(
    @Param('id') id: string,
    @Body() updatePackge: UpdatePackageRequest
  ): Promise<HttpResponse<PackageEntity>> {
    const updatePackage = await this.packageService.updatePackage(id, updatePackge);
    return HttpResponse.success(updatePackage);
  }
} 
