import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

export class CareerCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  readonly name: string;

  @IsNotEmpty()
  @IsUUID()
  readonly facultyId: string;
}
