import { IsBoolean, IsOptional, IsInt, IsDate } from 'class-validator';

export class PollingTableUpdateDto {
  @IsOptional()
  @IsInt()
  readonly numberTable?: number;

  @IsOptional()
  @IsBoolean()
  readonly isOpen?: boolean;

  @IsOptional()
  @IsDate()
  readonly dateOpen?: Date;

  @IsOptional()
  @IsDate()
  readonly dateClosed?: Date;
}
