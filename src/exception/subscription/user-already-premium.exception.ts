import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyPremiumException extends AppException {
  constructor() {
    super(StatusCode.USER_ALREADY_PREMIUM, HttpStatus.BAD_REQUEST);
  }
}
