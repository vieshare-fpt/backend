import { Role } from '@constant/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsString } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  roles: Role[];

  @ApiProperty({ default: false })
  @IsBoolean()
  isDelete: boolean;

}
