import { StatusCode } from "@constant/status-code.enum";
import { AppException } from "@exception/app.exception";
import { HttpStatus } from "@nestjs/common";


export class BalanceNotEnoughException extends AppException {
    constructor() {
        super(StatusCode.BALANCE_NOT_ENOUGH, HttpStatus.BAD_REQUEST )
    }
}
