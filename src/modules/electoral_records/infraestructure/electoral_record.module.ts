import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectoralRecordEntity } from '../domain/model/electoral_record.entity';
import { ElectoralRecordController } from './electoral_record.controller';
import { ElectoralRecordRepository } from '../domain/repository/electoral_record.repository';
import { ElectoralRecordService } from './electoral_record.service';
import { ElectoralRecordSignatureRepository } from 'src/modules/electoral_records_signature/domain/repository/electoral_record_signature.repository';
import { PollingTablesRepository } from 'src/modules/polling_tables/domain/repository/polling_table.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { DataHashRepository } from 'src/modules/hashes/domain/repository/data_hash.repository';
import { StudentsFrontRepository } from 'src/modules/students_fronts/domain/repository/student_front.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElectoralRecordRepository,
      UserRepository,
      ElectoralRecordSignatureRepository,
      PollingTablesRepository,
      StudentsFrontRepository,
      DataHashRepository,
    ]),
  ],
  controllers: [ElectoralRecordController],
  providers: [ElectoralRecordService, ContractService, DataHashService],
  exports: [ElectoralRecordService],
})
export class ElectoralRecordModule {}
