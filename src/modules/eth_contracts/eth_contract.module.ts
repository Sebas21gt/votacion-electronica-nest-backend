import { Module } from '@nestjs/common';
import { ContractService } from './eth_contract.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ContractService],
})

export class ContractModule {}