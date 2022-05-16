import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'
import { Role, Status, UserType } from '../entities/user.entity';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string

}
