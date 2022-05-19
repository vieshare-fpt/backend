import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'
import { UserRole, UserStatus, UserType } from '../entities/user.entity';

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

    @IsEnum(UserRole)
    role: string;

    @IsEnum(UserStatus)
    status: string;

    @IsEnum(UserType)
    userType: string;
}
