import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotePremiumCanNotVotePostException extends AppException {
  constructor() {
    super(StatusCode.USER_NOT_PREMIUM_CAN_NOT_VOTE_POST, HttpStatus.BAD_REQUEST);
  }
}
