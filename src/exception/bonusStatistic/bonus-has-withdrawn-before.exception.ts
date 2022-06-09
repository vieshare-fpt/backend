import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class BonusHasWithdrawnBeforeException extends AppException {
  constructor() {
    super(StatusCode.BONUS_HAS_WITHDRAWN_BEFORE, HttpStatus.NOT_FOUND);
  }
}
