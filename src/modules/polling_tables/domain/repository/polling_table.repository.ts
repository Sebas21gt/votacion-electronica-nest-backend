// src/polling_tables/polling_tables.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { PollingTableEntity } from '../model/polling_table.entity';
import { PollingTableCreateDto } from '../dto/polling_table_create.dto';
import { PollingTableUpdateDto } from '../dto/polling_table_update.dto';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { DelegatesEntity } from 'src/modules/delegates/domain/model/delegate.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';

@EntityRepository(PollingTableEntity)
export class PollingTablesRepository extends Repository<PollingTableEntity> {
  async createPollingTable(
    dto: PollingTableCreateDto,
  ): Promise<PollingTableEntity> {
    const pollingTable = this.create(dto);
    try {
      await this.save(pollingTable);
      return pollingTable;
    } catch (error) {
      throw new Error('Failed to create polling table: ' + error.message);
    }
  }

  async updatePollingTable(
    id: string,
    dto: PollingTableUpdateDto,
  ): Promise<PollingTableEntity> {
    const pollingTable = await this.findOne(id);
    if (!pollingTable) {
      throw new Error('Polling table not found');
    }
    this.merge(pollingTable, dto);
    try {
      await this.save(pollingTable);
      return pollingTable;
    } catch (error) {
      throw new Error('Failed to update polling table: ' + error.message);
    }
  }

  async findPollingTableById(id: string): Promise<any> {
    try {
      const pollingTable = await this.findOne(id);
      if (!pollingTable) {
        throw new Error('Polling table not found');
      }

      const totalVotes = await this.manager.count(StudentEntity, {
        where: { pollingTableId: pollingTable.id, isVoted: true },
      });

      return {
        ...pollingTable,
        totalVotes,
      };
    } catch (error) {
      throw new Error('Failed to retrieve polling table: ' + error.message);
    }
  }

  async closeTable(delegate: any, pollingTable: any, threshold: number) {
    pollingTable.totalAuthorizations += 1;
    if (pollingTable.totalAuthorizations > threshold) {
      pollingTable.isOpen = false;
    }

    try {
      await this.manager.update(DelegatesEntity, delegate.id, delegate);
      await this.manager.update(
        PollingTableEntity,
        pollingTable.id,
        pollingTable,
      );
      return pollingTable;
    } catch (error) {
      throw new Error('Failed to close polling table: ' + error.message);
    }
  }

  async findAllPollingTables(): Promise<PollingTableEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new Error('Failed to retrieve polling tables: ' + error.message);
    }
  }

  async deletePollingTable(id: string): Promise<void> {
    try {
      const result = await this.findOne(id);
      result.status = StatusEnum.Deleted;
      await this.save(result);
    } catch (error) {
      throw new Error('Failed to delete polling table: ' + error.message);
    }
  }
}
