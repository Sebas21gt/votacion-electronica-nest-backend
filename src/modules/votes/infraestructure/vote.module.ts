import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesRepository } from '../domain/repository/vote.repository';
import { VotesController } from './vote.controller';
import { VotesService } from './vote.service';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { DataHashRepository } from 'src/modules/hashes/domain/repository/data_hash.repository';

@Module({
    imports: [TypeOrmModule.forFeature([VotesRepository, DataHashRepository])],
    controllers: [VotesController],
    providers: [VotesService, ContractService, DataHashService],
    exports: [VotesService],
})
export class VotesModule {}
