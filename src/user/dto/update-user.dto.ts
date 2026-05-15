import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsString()
    @MinLength(3)
    name: string;
    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password: string;
}
