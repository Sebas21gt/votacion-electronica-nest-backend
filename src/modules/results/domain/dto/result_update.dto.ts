import { IsNotEmpty, IsInt, IsUUID, IsOptional } from 'class-validator';

export class ResultUpdateDto {
  @IsOptional()
  @IsUUID()
  readonly electoralRecordId: string;

  @IsOptional()
  @IsUUID()
  readonly studentFrontId: string;

  @IsOptional()
  @IsInt()
  readonly votes: number;
}
