import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoverLetterRepository } from "@repository/coverLetter.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/commom/common.service";
import { CoverLetterService } from "./coverLetter.service";

@Module({
  imports: [TypeOrmModule.forFeature([CoverLetterRepository,UserRepository])],
  providers: [CoverLetterService, CommonService],
  exports: [CoverLetterService]
})
export class CoverLetterModule { }
