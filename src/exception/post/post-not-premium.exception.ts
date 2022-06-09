import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class PostNotPremiumException extends AppException {
  constructor() {
    super(StatusCode.POST_NOT_PREMIUM, HttpStatus.BAD_REQUEST);
  }
}
