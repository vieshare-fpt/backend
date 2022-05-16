import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'
import { Role, Status, UserType } from '../entities/user.entity';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    hashPassword: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEnum(Role)
    role: string;

    @IsEnum(Status)
    status: string;

    @IsEnum(UserType)
    userType: string;
}
