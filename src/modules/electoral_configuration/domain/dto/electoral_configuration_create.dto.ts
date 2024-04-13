import { IsNotEmpty, IsDate, IsInt, IsUUID } from 'class-validator';

export class ElectoralConfigurationCreateDto {
  @IsNotEmpty()
  @IsDate()
  readonly electionDateStart: Date;

  @IsNotEmpty()
  @IsDate()
  readonly electionDateFinish: Date;

  @IsNotEmpty()
  readonly timeElection: string;

  @IsNotEmpty()
  @IsInt()
  readonly numberTableElections: number;

  @IsNotEmpty()
  @IsUUID()
  readonly careersId: string;
}
