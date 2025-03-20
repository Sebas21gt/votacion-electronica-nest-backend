import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FacultyCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly address: string;
}