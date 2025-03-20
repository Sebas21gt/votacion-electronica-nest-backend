import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';

export class CareerUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  readonly name?: string;

  @IsOptional()
  @IsUUID()
  readonly facultyId?: string;
}
