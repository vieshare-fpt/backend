import { StatusCode } from "@constant/status-code.enum";
import { AppException } from "@exception/app.exception";
import { HttpStatus } from "@nestjs/common";

export class WalletAlreadyExistedException extends AppException{
  constructor(){
    super(StatusCode.WALLET_ALREADY_EXISTED,HttpStatus.BAD_REQUEST)
  }
}
