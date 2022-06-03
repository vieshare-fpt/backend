import { StatusCode } from "@constant/status-code.enum";
import { AppException } from "@exception/app.exception";
import { HttpStatus } from "@nestjs/common";


export class WalletNotExistedException extends AppException {
    constructor() {
        super(StatusCode.WALLET_NOT_EXISTED, HttpStatus.BAD_REQUEST )
    }
}
