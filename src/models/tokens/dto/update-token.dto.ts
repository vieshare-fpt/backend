
import {IsUUID,IsDate,IsNumber,IsNotEmpty,IsString} from 'class-validator'

export class UpdateTokenDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsUUID()
    refreshToken: string;

    @IsString()
    agent: string;

    @IsDate()
    dateExpire: Date;


}
