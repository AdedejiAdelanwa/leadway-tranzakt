import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/transactions/entities';

const UserGenders: (keyof typeof Gender)[] = ['male', 'female'];

export class RegisterUserRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  lastName: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;

  @ApiProperty({ enum: UserGenders })
  @IsEnum(UserGenders)
  gender: keyof typeof Gender;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  dob: string;
}
