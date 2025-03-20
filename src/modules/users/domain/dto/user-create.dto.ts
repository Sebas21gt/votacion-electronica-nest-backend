import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}