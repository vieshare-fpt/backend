import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomeStatisticDto } from './create-income-statistic.dto';

export class UpdateIncomeStatisticDto extends PartialType(CreateIncomeStatisticDto) {}
