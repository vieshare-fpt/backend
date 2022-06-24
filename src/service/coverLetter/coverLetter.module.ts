import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoverLetterRepository } from "@repository/coverLetter.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { UserService } from "@service/user/user.service";
import { CoverLetterService } from "./coverLetter.service";

@Module({
  imports: [TypeOrmModule.forFeature([CoverLetterRepository,UserRepository])],
  providers: [CryptStrategy,CoverLetterService, CommonService,UserService],
  exports: [CoverLetterService]
})
export class CoverLetterModule { }
