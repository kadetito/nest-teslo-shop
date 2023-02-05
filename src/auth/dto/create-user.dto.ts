import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  surName: string;

  @ApiProperty()
  @IsString()
  telefono: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  create_pin: string;

  @ApiProperty()
  @IsString()
  cc_aa: string;

  @ApiProperty()
  @IsString()
  card_club: string;
}
