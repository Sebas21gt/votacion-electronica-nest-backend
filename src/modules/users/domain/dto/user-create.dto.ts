import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}