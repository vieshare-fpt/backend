import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class FollowThemselvesException extends AppException {
  constructor() {
    super(StatusCode.FOLLOW_THEMSELVES_INVALID, HttpStatus.BAD_REQUEST);
  }
}
