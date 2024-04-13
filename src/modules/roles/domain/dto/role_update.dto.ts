import { IsString, MaxLength, IsOptional, IsInt } from 'class-validator';

export class RoleUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly description?: string;

  @IsOptional()
  @IsInt()
  readonly status?: number;
}
