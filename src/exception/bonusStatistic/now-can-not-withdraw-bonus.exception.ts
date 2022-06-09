import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class NowCanNotWithdrawBonusException extends AppException {
  constructor() {
    super(StatusCode.NOW_CAN_NOT_WITHDRAW_BONUS, HttpStatus.BAD_REQUEST);
  }
}
