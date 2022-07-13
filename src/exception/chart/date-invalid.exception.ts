import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class DateInvalidException extends AppException {
  constructor() {
    super(StatusCode.DATE_INVALID, HttpStatus.NOT_FOUND);
  }
}
