import { IsNotEmpty, IsString } from 'class-validator';

export class VoteCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly voteFrontId: string; //This vote is a hash of the vote

  @IsNotEmpty()
  @IsString()
  readonly signature: string;

}
