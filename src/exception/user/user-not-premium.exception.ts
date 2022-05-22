import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotPremiumException extends AppException {
  constructor() {
    super(StatusCode.USER_NOT_PREMIUM, HttpStatus.UNAUTHORIZED);
  }
}
