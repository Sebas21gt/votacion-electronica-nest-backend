import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingTableEntity } from '../domain/model/polling_table.entity';
import { PollingTablesRepository } from '../domain/repository/polling_table.repository';
import { PollingTablesService } from './polling_table.service';
import { PollingTablesController } from './polling_table.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PollingTableEntity])],
  providers: [PollingTablesService, PollingTablesRepository],
  controllers: [PollingTablesController],
  exports: [PollingTablesService],
})
export class PollingTablesModule {}
