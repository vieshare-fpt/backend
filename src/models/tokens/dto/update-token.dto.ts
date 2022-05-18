
import {IsUUID,IsNotEmpty,IsDate} from 'class-validator'

export class UpdateTokenDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsDate()
    validUntil: Date;
}
