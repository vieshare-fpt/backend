import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { BonusFormulaOrderBy } from "@constant/bonus-formula-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { BonusFormulaEntity } from "@data/entity/bonus-formula.entity";
import { IdFormulaRequest } from "@data/request/id-formula.requests";
import { NewFormulaRequest } from "@data/request/new-formula.request";
import { PagingRequest } from "@data/request/paging.request";
import { Roles } from "@decorator/role.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BonusFormulaService } from "@service/bonusFormula/bonusFormula.service";


@ApiTags('Bonus Forumla')
@Controller('api/bonus-formula')
export class BonusFormulaController {
  constructor(
    private bonusFormulaService: BonusFormulaService
  ) { }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch('')
  @HttpCode(HttpStatus.OK)
  async activationTheFormula(
    @Body() IdFormulaRequest: IdFormulaRequest
  ): Promise<HttpResponse<BonusFormulaEntity>> {
    const activationTheFormula = await this.bonusFormulaService.activationTheFormula(IdFormulaRequest.id)
    return HttpResponse.success(activationTheFormula);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createNewFormula(
    @Body() newFormulaRequest: NewFormulaRequest
  ): Promise<HttpResponse<BonusFormulaEntity>> {
    const createNewFormula = await this.bonusFormulaService.createNewFormula(newFormulaRequest)
    return HttpResponse.success(createNewFormula);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: BonusFormulaOrderBy, example: BonusFormulaOrderBy.createDate, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getBounusFormulaIsActive(
    @Query('order_by') orderBy: BonusFormulaOrderBy,
    @Query('sort') sort: Sort,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<BonusFormulaEntity[]> | HttpPagingResponse<BonusFormulaEntity[]> | any> {
    const isActive = true;
    const bonusFormulaResponse = await this.bonusFormulaService.getAllBounsFormualOrderBy(orderBy, sort, paging.per_page, paging.page, isActive)
    return bonusFormulaResponse;
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiParam({ name: 'id', example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4', required: false })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getFormula(
    @Param('id') id: string,
  ): Promise<HttpResponse<BonusFormulaEntity>> {
    return HttpResponse.success(await this.bonusFormulaService.getBonusFormulaById(id))
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: BonusFormulaOrderBy, example: BonusFormulaOrderBy.createDate, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getFormulas(
    @Query('order_by') orderBy: BonusFormulaOrderBy,
    @Query('sort') sort: Sort,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<BonusFormulaEntity[]>> {
    const bonusFormulaResponse = await this.bonusFormulaService.getAllBounsFormualOrderBy(orderBy, sort, paging.per_page, paging.page)
    return bonusFormulaResponse;
  }
}
