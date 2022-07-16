import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class OnlyUserCanFollowException extends AppException {
  constructor() {
    super(StatusCode.ONLY_USER_CAN_FOLLOW, HttpStatus.BAD_REQUEST);
  }
}
