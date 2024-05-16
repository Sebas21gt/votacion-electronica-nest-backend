import { IsOptional, IsDate, IsInt, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  readonly careersId: string[];
}
