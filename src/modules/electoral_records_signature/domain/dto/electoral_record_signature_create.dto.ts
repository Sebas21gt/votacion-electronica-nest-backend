import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class ElectoralRecordSignatureCreateDto {
  @IsNotEmpty()
  @IsUUID()
  readonly electoralRecordId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly delegateId: string;

  @IsNotEmpty()
  @IsString()
  readonly signature: string;
}
