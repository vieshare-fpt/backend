import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class FollowNotExistedException extends AppException {
  constructor() {
    super(StatusCode.FOLLOW_NOT_EXISTING, HttpStatus.BAD_REQUEST);
  }
}