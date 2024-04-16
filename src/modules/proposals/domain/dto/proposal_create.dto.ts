import { IsString, MaxLength, IsUUID } from 'class-validator';

export class ProposalCreateDto {
  @IsString()
  @MaxLength(500)
  readonly description?: string;

  @IsUUID()
  readonly studentFrontId?: string;
}
