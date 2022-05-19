import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncomeStatisticsService } from './income-statistics.service';
import { CreateIncomeStatisticDto } from './dto/create-income-statistic.dto';
import { UpdateIncomeStatisticDto } from './dto/update-income-statistic.dto';

@Controller('income-statistics')
export class IncomeStatisticsController {
  constructor(private readonly incomeStatisticsService: IncomeStatisticsService) {}

  @Post()
  create(@Body() createIncomeStatisticDto: CreateIncomeStatisticDto) {
    return this.incomeStatisticsService.create(createIncomeStatisticDto);
  }

  @Get()
  findAll() {
    return this.incomeStatisticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeStatisticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeStatisticDto: UpdateIncomeStatisticDto) {
    return this.incomeStatisticsService.update(+id, updateIncomeStatisticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomeStatisticsService.remove(+id);
  }
}
