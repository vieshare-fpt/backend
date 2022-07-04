
import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty } from 'class-validator';

export class UpdateAvatarRequest {
  @ApiProperty()
  @IsNotEmpty()
  avatar: string;
}
