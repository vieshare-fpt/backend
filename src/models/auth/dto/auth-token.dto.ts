import { IsNumber, IsNotEmpty, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';


export class AuthTokenDto {
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}
