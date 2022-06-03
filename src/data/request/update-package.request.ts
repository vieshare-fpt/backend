import { ApiProperty } from "@nestjs/swagger";

export class UpdatePackageRequest {
  @ApiProperty()
  name: string

  @ApiProperty()
  expiresAfterNumberOfDays: number;

  @ApiProperty()
  price: number

  @ApiProperty()
  isActive: Boolean
}
