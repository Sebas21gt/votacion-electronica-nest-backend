import { IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class ResultCreateDto {
  @IsNotEmpty()
  @IsUUID()
  readonly electoralRecordId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly studentFrontId: string;

  @IsNotEmpty()
  @IsInt()
  readonly votes: number;
}
