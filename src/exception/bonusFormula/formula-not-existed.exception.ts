import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class FormulaNotExistedException extends AppException {
  constructor() {
    super(StatusCode.FORMULA_NOT_EXISTED, HttpStatus.NOT_FOUND);
  }
}
