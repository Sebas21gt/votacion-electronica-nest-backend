import {
  IsOptional,
  MaxLength,
  IsString,
} from 'class-validator';

export class ElectoralRecordUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly observation?: string;
}
