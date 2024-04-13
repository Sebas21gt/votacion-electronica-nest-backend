import { IsNotEmpty, IsString, MaxLength, IsOptional, IsInt } from 'class-validator';

export class RoleCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly description?: string;

  @IsNotEmpty()
  @IsInt()
  readonly status: number;
}