
import { StatusCoverLetter } from "@constant/status-cover-letter.enum";
import { CoverLetterEntity } from "@data/entity/cover-letter.entity";
import { ChangeRoleUserRequest } from "@data/request/change-role-user.request";
import { NewCoverLetterRequest } from "@data/request/new-cover-letter.request";
import { CoverLetterNotExistedException } from "@exception/coverLetter/cover-letter-not-existed.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { Injectable } from "@nestjs/common";
import { CoverLetterRepository } from "@repository/coverLetter.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { UserService } from "@service/user/user.service";
import { Not } from "typeorm";


@Injectable()
export class CoverLetterService {
  constructor(
    private coverLetterRepository: CoverLetterRepository,
    private userRepository: UserRepository,
    private userService: UserService,
    private commonService: CommonService<CoverLetterEntity>
  ) { }
  async createCoverLetter(newCoverLetterRequest: NewCoverLetterRequest, userId: string): Promise<CoverLetterEntity> {
    const existedUser = await this.userRepository.findOne({ id: userId });
    if (!existedUser) {
      throw new UserNotExistedException();
    }
    const coverLetter = new CoverLetterEntity()
    coverLetter.userId = userId;
    coverLetter.title = newCoverLetterRequest.title;
    coverLetter.content = newCoverLetterRequest.content;
    coverLetter.positionApply = newCoverLetterRequest.positionApply;

    const saveCoverLetter = await this.coverLetterRepository.save(coverLetter);
    return saveCoverLetter;
  }


  async getAllCoverLetter(): Promise<CoverLetterEntity[]> {
    const getAllCoverLetter = await this.coverLetterRepository.find({
      where: {
        status: StatusCoverLetter.Pending
      }
    })
    return getAllCoverLetter;
  }

  async getCoverLetterByUserId(userId: string): Promise<CoverLetterEntity[]> {
    const existedUser = await this.userRepository.findOne({ id: userId });
    if (!existedUser) {
      throw new UserNotExistedException();
    }
    const getCoverLetterByUserId = await this.coverLetterRepository.find({
      where: {
        userId: userId
      }
    })
    return getCoverLetterByUserId;
  }

  async HandleCoverLetter(coverLetterId: string, newStatus: StatusCoverLetter) {
    const coverLetterExisted = await this.coverLetterRepository.findOne({ id: coverLetterId });
    if (!coverLetterExisted) {
      throw new CoverLetterNotExistedException();
    }
    if (newStatus == StatusCoverLetter.Accepted) {
      const positionApply = coverLetterExisted.positionApply
      const user = await coverLetterExisted.user
      const changeRoleUser = new ChangeRoleUserRequest();
      changeRoleUser.userId = user.id;
      changeRoleUser.newRole = positionApply;
      await this.userService.changeRoleUserRequest(changeRoleUser)
    }

    const updateCoverLetterStatus = await this.coverLetterRepository.update(
      { id: coverLetterExisted.id },
      { status: newStatus }
    )
    return updateCoverLetterStatus.raw[0];
  }
}
