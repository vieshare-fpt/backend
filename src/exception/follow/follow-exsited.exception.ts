

import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class FollowExistedException extends AppException {
  constructor() {
    super(StatusCode.FOLLOW_EXISTED, HttpStatus.BAD_REQUEST);
  }
}
