import { PositionApply } from '@constant/position-apply.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleUserRequest {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  newRole: PositionApply;
}
