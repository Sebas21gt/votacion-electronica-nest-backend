import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsUUID()
  readonly status?: number;
}