import { TransactionEnum } from "@constant/type-transaction.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";


export class UpdateWalletRequest {
  @ApiProperty({format: "enum", enum: TransactionEnum })
    @IsNotEmpty()
    @IsEnum(TransactionEnum)
    type: TransactionEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    bankId: string;
}
