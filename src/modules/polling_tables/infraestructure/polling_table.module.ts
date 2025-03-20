import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingTablesRepository } from '../domain/repository/polling_table.repository';
import { PollingTablesService } from './polling_table.service';
import { PollingTablesController } from './polling_table.controller';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';
import { StudentRepository } from 'src/modules/students/domain/repository/student.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { PollingTableEntity } from '../domain/model/polling_table.entity';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashRepository } from 'src/modules/hashes/domain/repository/data_hash.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PollingTablesRepository,
      DelegatesRepository,
      StudentRepository,
      UserRepository,
      DataHashRepository,
    ]),
  ],
  providers: [PollingTablesService, ContractService, DataHashService],
  controllers: [PollingTablesController],
  exports: [PollingTablesService],
})
export class PollingTablesModule {}
