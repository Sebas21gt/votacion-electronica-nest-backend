import { IsString, MaxLength, IsUUID, IsOptional } from 'class-validator';

export class StudentPositionUpdateDto {
  @IsUUID()
  readonly studentId?: string;

  @IsUUID()
  readonly frontId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  readonly positionName?: string;

  @IsOptional()
  @IsString()
  readonly positionDescription?: string;
}
