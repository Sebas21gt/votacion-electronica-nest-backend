import { IsString, MaxLength, IsUUID, IsOptional } from 'class-validator';

export class ProposalUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly description?: string;

  @IsOptional()
  @IsUUID()
  readonly studentFrontId?: string;
}
