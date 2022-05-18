import { IsNumber, IsNotEmpty, IsString } from 'class-validator'
import { UpdateTokenDto } from './update-token.dto';
import { PartialType } from '@nestjs/mapped-types';


export class CreateTokenDto extends PartialType(UpdateTokenDto) {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    agent: string;
}
