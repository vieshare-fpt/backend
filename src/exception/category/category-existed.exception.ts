import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class CategoryExistedException extends AppException {
  constructor() {
    super(StatusCode.CATEGORY_EXISTED, HttpStatus.BAD_REQUEST);
  }
}
