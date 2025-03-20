import { IsOptional, IsUUID } from 'class-validator';

export class VoteUpdateDto {
  @IsOptional()
  @IsUUID()
  readonly studentId: string;

  @IsOptional()
  @IsUUID()
  readonly pollingTableId: string;
}
