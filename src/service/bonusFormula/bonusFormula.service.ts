import { BonusFormulaOrderBy } from "@constant/bonus-formula-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { BonusFormulaEntity } from "@data/entity/bonus-formula.entity";
import { NewFormulaRequest } from "@data/request/new-formula.request";
import { FormulaNotExistedException } from "@exception/bonusFormula/formula-not-existed.exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { CommonService } from "@service/commom/common.service";

@Injectable()
export class BonusFormulaService {
  constructor(
    private bonusFormulaRepository: BonusFormulaReposiotry,
    private commonService: CommonService<BonusFormulaEntity>
  ) { }

  async activationTheFormula(formulaId: string) {
    const formulaExisted = await this.getBonusFormulaById(formulaId);
    await this.bonusFormulaRepository.update({}, { isActive: false });
    const updateActive = await this.bonusFormulaRepository.update({ id: formulaExisted.id }, { isActive: true });
    return updateActive.raw[0];
  }

  async createNewFormula(newFormulaRequest: NewFormulaRequest) {
    const bonusFormulaEntity = new BonusFormulaEntity()
    bonusFormulaEntity.bonusPerView = newFormulaRequest.bonusPerView;
    bonusFormulaEntity.isActive = true;
    const newFormula = await this.bonusFormulaRepository.save(bonusFormulaEntity);
    await this.activationTheFormula(newFormula.id)
    return newFormula;
  }

  async getAllBounsFormual(perPage: number, page: number, isActive?: Boolean) {
    page = page ? page : 1;
    const bonusFormulasResponse = await this.bonusFormulaRepository.getPackges(perPage * (page - 1), perPage, isActive)
    const total = await this.bonusFormulaRepository.countIsActive(isActive);

    return this.commonService.getPagingResponse(bonusFormulasResponse, perPage, page, total)
  }

  async getAllBounsFormualOrderBy(orderBy: BonusFormulaOrderBy, sort: Sort, perPage: number, page: number, isActive?: Boolean) {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;

    if (!orderBy) {
      return this.getAllBounsFormual(perPage, page, isActive);
    }

    orderBy = BonusFormulaOrderBy[orderBy];
    if (!orderBy) {
      throw new BadRequestException()
    }
    const bonusFormulasResponse = await this.bonusFormulaRepository.getPackgesOrderBy(orderBy, sort, perPage * (page - 1), perPage, isActive);
    const total = await this.bonusFormulaRepository.countIsActive(isActive);
    return this.commonService.getPagingResponse(bonusFormulasResponse, perPage, page, total)
  }

  async getBonusFormulaById(id: string) {
    const formulaExisted = await this.bonusFormulaRepository.findOne(id);
    if (!formulaExisted) {
      throw new FormulaNotExistedException()
    }
    return formulaExisted;
  }

  async getActiveFormulaIsActive(): Promise<BonusFormulaEntity> {
    const formula = await this.bonusFormulaRepository.findOne({ isActive: true });
    return formula;
  }
}
