import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string

}
