import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'
import { UserDto } from './user.dto';

export class CreateUserDto extends PartialType(UserDto) {

    @IsString()
    @IsNotEmpty()
    password?: string;


}
