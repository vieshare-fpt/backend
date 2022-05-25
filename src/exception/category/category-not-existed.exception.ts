import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class CategoryNotExistedException extends AppException {
  constructor() {
    super(StatusCode.CATEGORY_NOT_EXISTED, HttpStatus.NOT_FOUND);
  }
}
