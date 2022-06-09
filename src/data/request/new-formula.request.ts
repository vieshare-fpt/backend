import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NewFormulaRequest {
  @ApiProperty()
  @IsNotEmpty()
  bonusPerView: number;
}
