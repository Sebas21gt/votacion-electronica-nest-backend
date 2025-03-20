import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsUUID()
  status?: number;
}