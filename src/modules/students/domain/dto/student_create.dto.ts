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
  @MaxLength(80)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly collegeNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isHabilitated: boolean;

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
