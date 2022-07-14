import { Role } from '@constant/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsString } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Role })
  roles: Role[];

  @ApiProperty({ default: false })
  isDelete: boolean;

}
