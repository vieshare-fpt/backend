import { TransactionEnum } from "@constant/type-transaction.enum";
import { ApiProperty } from "@nestjs/swagger";
import {  IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class TransactionRequest{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ format: 'enum', enum: TransactionEnum })
    @IsNotEmpty()
    @IsEnum(TransactionEnum)
    typeTransaction: TransactionEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    bankID: string;

    @ApiProperty()
    @IsUUID()
    walletID: string;
}