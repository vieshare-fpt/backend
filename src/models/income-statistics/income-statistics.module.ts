import { Module } from '@nestjs/common';
import { IncomeStatisticsService } from './income-statistics.service';
import { IncomeStatisticsController } from './income-statistics.controller';

@Module({
  controllers: [IncomeStatisticsController],
  providers: [IncomeStatisticsService]
})
export class IncomeStatisticsModule {}
