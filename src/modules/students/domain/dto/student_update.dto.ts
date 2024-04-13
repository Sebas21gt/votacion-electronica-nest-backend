import {
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class StudentUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly collegeNumber?: string;

  @IsOptional()
  @IsBoolean()
  readonly isHabilitated?: boolean;

  @IsOptional()
  @IsUUID()
  readonly userId?: string;
}
