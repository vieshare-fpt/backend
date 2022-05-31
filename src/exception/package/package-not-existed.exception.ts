import { StatusCode } from '@constant/status-code.enum';
import { AppException } from '@exception/app.exception';
import { HttpStatus } from '@nestjs/common';

export class PackageNotExistedException extends AppException {
  constructor() {
    super(StatusCode.PACKAGE_NOT_EXISTING, HttpStatus.BAD_REQUEST);
  }
}
