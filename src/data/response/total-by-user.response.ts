import { ApiProperty } from "@nestjs/swagger";


export class TotalByUserResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  user: number;

  @ApiProperty()
  writer: number;

  @ApiProperty()
  admin: number;

  @ApiProperty()
  sensor: number;


  constructor(user: number, writer: number, admin: number, sensor: number) {
    this.user = user;
    this.writer = writer;
    this.admin = admin;
    this.sensor = sensor;
    this.total = user + writer + admin + sensor;
  }
}
