import { IsNotEmpty, IsUUID } from 'class-validator';

export class VoteCreateDto {
  @IsNotEmpty()
  @IsUUID()
  readonly studentId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly pollingTableId: string;
}
