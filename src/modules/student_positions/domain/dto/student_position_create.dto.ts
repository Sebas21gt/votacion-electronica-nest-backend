import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

export class StudentPositionCreateDto {
  @IsNotEmpty()
  @IsUUID()
  readonly studentId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly frontId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  readonly positionName: string;

  @IsString()
  readonly positionDescription: string;
}
