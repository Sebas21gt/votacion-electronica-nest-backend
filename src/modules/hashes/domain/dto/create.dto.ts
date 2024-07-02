import { IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';

export class DataHashCreateDto {
  @IsNumber()
  @MaxLength(500)
  readonly nonce: number;

  @IsNumber()
  readonly chainId: number;

  @IsString()
  readonly signature: string;

  @IsString()
  readonly blockHash: string;

  @IsString()
  readonly dateTransaction: string;

  @IsNumber()
  readonly blockNumber: number;

  @IsString()
  readonly resultEvent: string;

  constructor(data: DataHashCreateDto) {
    this.nonce = data.nonce;
    this.chainId = data.chainId;
    this.signature = data.signature;
    this.blockHash = data.blockHash;
    this.dateTransaction = data.dateTransaction;
    this.blockNumber = data.blockNumber;
    this.resultEvent = data.resultEvent;
  }
}