import {
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class StudentUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(400)
  readonly fullname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly collegeNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly ciNumber?: string;

  @IsOptional()
  @IsBoolean()
  readonly isHabilitated?: boolean;

  @IsOptional()
  @IsUUID()
  readonly userId?: string;
}
