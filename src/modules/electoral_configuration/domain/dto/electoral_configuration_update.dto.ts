import { IsOptional, IsDate, IsInt, IsUUID } from 'class-validator';

export class ElectoralConfigurationUpdateDto {
  @IsOptional()
  @IsDate()
  readonly electionDateStart?: Date;

  @IsOptional()
  @IsDate()
  readonly electionDateFinish?: Date;

  @IsOptional()
  readonly timeElection?: string;

  @IsOptional()
  @IsInt()
  readonly numberTableElections?: number;

  @IsOptional()
  @IsUUID()
  readonly careersId?: string;
}
