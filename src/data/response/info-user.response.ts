import { Role } from '@constant/role.enum';
import { Gender } from '@constant/user-gender.enum';
import { UserEntity } from '@data/entity/user.entity';

export class InfoUserResponse {
  id: string;

  name: string;

  dateOfBirth: string;

  gender: Gender;

  roles: Role[];

  avatar: string;


  static formatEntity(user: UserEntity): InfoUserResponse {
    const userResponse = new InfoUserResponse();
    userResponse.id = user.id;
    userResponse.name = user.name;
    userResponse.dateOfBirth = user.dob;
    userResponse.gender = user.gender;
    userResponse.roles = user.roles;
    userResponse.avatar = user.avatar;

    return userResponse;
  }
}
