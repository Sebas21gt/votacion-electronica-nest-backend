import { IsNotEmpty, IsBoolean, IsInt, IsUUID, IsDate } from 'class-validator';

export class PollingTableCreateDto {
  @IsNotEmpty()
  @IsInt()
  readonly numberTable: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly isOpen: boolean;

  @IsNotEmpty()
  @IsUUID()
  readonly electoralConfigurationId: string;

  @IsNotEmpty()
  @IsDate()
  readonly dateOpen: Date;

}
