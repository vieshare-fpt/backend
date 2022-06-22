import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class CoverLetterNotExistedException extends AppException {
  constructor() {
    super(StatusCode.COVER_LETTER_NOT_EXISTED, HttpStatus.BAD_REQUEST);
  }
}

