import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
