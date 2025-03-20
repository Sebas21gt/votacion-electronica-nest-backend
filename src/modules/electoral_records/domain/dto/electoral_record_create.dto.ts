import {
  IsOptional,
  IsDate,
  IsInt,
  MaxLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class ElectoralRecordCreateDto {
  @IsNotEmpty()
  @IsDate()
  readonly openDate?: Date;

  @IsNotEmpty()
  @IsDate()
  readonly closeDate?: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  readonly observation?: string;

  @IsNotEmpty()
  @IsInt()
  readonly votesNull: number;
}
