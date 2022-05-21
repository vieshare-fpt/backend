import { Injectable } from '@nestjs/common';
import { CreateIncomeStatisticDto } from './dto/create-income-statistic.dto';
import { UpdateIncomeStatisticDto } from './dto/update-income-statistic.dto';

@Injectable()
export class IncomeStatisticsService {
  create(createIncomeStatisticDto: CreateIncomeStatisticDto) {
    return 'This action adds a new incomeStatistic';
  }

  findAll() {
    return `This action returns all incomeStatistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incomeStatistic`;
  }

  update(id: number, updateIncomeStatisticDto: UpdateIncomeStatisticDto) {
    return `This action updates a #${id} incomeStatistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} incomeStatistic`;
  }
}
