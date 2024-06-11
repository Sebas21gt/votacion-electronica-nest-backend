import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class ElectoralRecordSignatureCreateDto {
  @IsNotEmpty()
  @IsUUID()
  readonly electoralRecordId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly signature: string;

  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @IsString()
  readonly position: string;
}
