import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsEmail, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsEmail()
    email: string;
    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password: string;

}