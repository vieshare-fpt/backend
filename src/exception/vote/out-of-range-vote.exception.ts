import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class OutOfRangeVoteException extends AppException {
  constructor() {
    super(StatusCode.OUT_OF_RANGE_VOTE, HttpStatus.BAD_REQUEST);
  }
}
