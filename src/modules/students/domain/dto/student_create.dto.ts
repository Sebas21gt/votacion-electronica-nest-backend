import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class StudentCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  readonly fullname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly collegeNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly ciNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isHabilitated: boolean;
}
