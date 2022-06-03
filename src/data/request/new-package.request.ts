import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NewPackageRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ examples: ["1,20,30"], description: "After how many days will the package expire?" })
  @IsNotEmpty()
  expiresAfterNumberOfDays: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number
}
