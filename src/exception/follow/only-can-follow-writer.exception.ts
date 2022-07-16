import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class OnlyFollowWriterException extends AppException {
  constructor() {
    super(StatusCode.ONLY_CAN_FOLLOW_WRITER, HttpStatus.BAD_REQUEST);
  }
}
