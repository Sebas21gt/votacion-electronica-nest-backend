import {
  IsOptional,
  IsDate,
  IsInt,
  MaxLength,
  IsString,
} from 'class-validator';

export class ElectoralRecordCreateDto {
  @IsOptional()
  @IsDate()
  readonly openDate?: Date;

  @IsOptional()
  @IsDate()
  readonly closeDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly observation?: string;

  @IsInt()
  readonly votesNull: number;
}
