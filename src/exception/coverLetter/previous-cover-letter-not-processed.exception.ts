import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class PreviousCoverLetterNotProcessedException extends AppException {
  constructor() {
    super(StatusCode.PREVIOUS_COVER_LETTER_NOT_PROCESSED, HttpStatus.BAD_REQUEST);
  }
}

