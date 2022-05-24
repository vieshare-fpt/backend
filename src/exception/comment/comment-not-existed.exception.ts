import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class CommentNotExistedException extends AppException {
  constructor() {
    super(StatusCode.COMMENT_NOT_EXISTED, HttpStatus.NOT_FOUND);
  }
}
