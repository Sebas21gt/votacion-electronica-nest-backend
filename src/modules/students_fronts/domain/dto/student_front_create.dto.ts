import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class StudentsFrontCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly acronym: string;

  @IsNotEmpty()
  readonly logo: Buffer;

}
