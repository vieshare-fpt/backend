import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotCommenterPostException extends AppException {
  constructor() {
    super(StatusCode.USER_NOT_COMMENTER_POST, HttpStatus.BAD_REQUEST);
  }
}
