import { IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class StudentsFrontUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly acronym?: string;
}
