import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FacultyUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly address?: string;
}