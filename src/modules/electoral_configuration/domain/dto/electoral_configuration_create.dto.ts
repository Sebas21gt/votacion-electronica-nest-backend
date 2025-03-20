import { IsNotEmpty, IsDate, IsInt, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  readonly careersId: string[];
}
