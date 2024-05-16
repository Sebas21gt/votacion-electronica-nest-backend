import { IsUUID, IsNotEmpty } from 'class-validator';

export class DelegateCreateDto {
  @IsNotEmpty({ message: 'Polling table id is required'})
  @IsUUID()
  readonly pollingTableId?: string;
  
  @IsNotEmpty({ message: 'Student front id is required'})
  @IsUUID()
  readonly studentFrontId?: string;

  @IsNotEmpty({ message: 'Student back id is required'})
  @IsUUID()
  readonly studentId?: string;
}
