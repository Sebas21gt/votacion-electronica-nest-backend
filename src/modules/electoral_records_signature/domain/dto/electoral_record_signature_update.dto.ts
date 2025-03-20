import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ElectoralRecordSignatureUpdateDto {
  @IsOptional()
  @IsUUID()
  readonly electoralRecordId: string;

  @IsOptional()
  @IsUUID()
  readonly delegateId: string;

  @IsOptional()
  @IsString()
  readonly signature: string;
}
