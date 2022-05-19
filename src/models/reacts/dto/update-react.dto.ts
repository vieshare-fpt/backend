import { PartialType } from '@nestjs/mapped-types';
import { CreateReactDto } from './create-react.dto';

export class UpdateReactDto extends PartialType(CreateReactDto) {}
