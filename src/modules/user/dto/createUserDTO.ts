// create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'User name is required' })
  userName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty({ message: 'User name is required' })
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @IsOptional()
  email?: string;
}

export class UpdatePasswordDTO {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
