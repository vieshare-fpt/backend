import { TransactionEnum } from "@constant/type-transaction.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";


export class UpdateWalletRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TransactionEnum)
    type: TransactionEnum;

    @ApiProperty({format: "enum", enum: TransactionEnum })
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    bankId: string;
}