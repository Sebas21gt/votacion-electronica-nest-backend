import { IsUUID, IsOptional } from 'class-validator';

export class DelegateUpdateDto {
  @IsOptional()
  @IsUUID()
  readonly pollingTableId?: string;

  @IsOptional()
  @IsUUID()
  readonly studentId?: string;

  @IsOptional()
  @IsUUID()
  readonly studentFrontId?: string;
}
