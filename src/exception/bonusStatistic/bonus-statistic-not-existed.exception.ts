import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class BonusNotExistedException extends AppException {
  constructor() {
    super(StatusCode.BONUS_NOT_EXISTED, HttpStatus.BAD_REQUEST);
  }
}
