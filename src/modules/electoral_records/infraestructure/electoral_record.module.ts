import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectoralRecordEntity } from '../domain/model/electoral_record.entity';
import { ElectoralRecordController } from './electoral_record.controller';
import { ElectoralRecordRepository } from '../domain/repository/electoral_record.repository';
import { ElectoralRecordService } from './electoral_record.service';

@Module({
  imports: [TypeOrmModule.forFeature([ElectoralRecordEntity])],
  controllers: [ElectoralRecordController],
  providers: [ElectoralRecordService, ElectoralRecordRepository],
  exports: [ElectoralRecordService],
})
export class ElectoralRecordModule {}
