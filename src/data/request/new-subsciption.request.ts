import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NewSubscriptionRequest {
  @ApiProperty()
  @IsNotEmpty()
  packageId: string;
}
