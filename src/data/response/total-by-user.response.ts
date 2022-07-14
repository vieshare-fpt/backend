import { ApiProperty } from "@nestjs/swagger";


export class TotalByUserResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  userFree: number;

  @ApiProperty()
  userPremium: number;

  @ApiProperty()
  writer: number;

  @ApiProperty()
  admin: number;

  @ApiProperty()
  sensor: number;


  constructor(userFree: number, userPremium: number, writer: number, admin: number, sensor: number) {
    this.userFree = userFree;
    this.userPremium = userPremium;
    this.writer = writer;
    this.admin = admin;
    this.sensor = sensor;
    this.total = userFree + userPremium + writer + admin + sensor;
  }
}
