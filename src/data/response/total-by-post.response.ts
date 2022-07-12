import { ApiProperty } from "@nestjs/swagger";


export class TotalByPostResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  free: number;

  @ApiProperty()
  premium: number;



  constructor(free: number, premium: number) {
    this.free = free;
    this.premium = premium;
    this.total = free + premium;
  }
}
