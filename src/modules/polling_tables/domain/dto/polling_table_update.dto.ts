import { IsBoolean, IsOptional, IsInt } from 'class-validator';

export class PollingTableUpdateDto {
  @IsOptional()
  @IsInt()
  readonly numberTable?: number;

  @IsOptional()
  @IsBoolean()
  readonly isOpen?: boolean;
}
