import { StatusCode } from "@constant/status-code.enum";
import { AppException } from "@exception/app.exception";
import { HttpStatus } from "@nestjs/common";

export class InvalidAmountException extends AppException {
    constructor(){
        super(StatusCode.AMOUNT_INVALID, HttpStatus.BAD_REQUEST);
    }
}