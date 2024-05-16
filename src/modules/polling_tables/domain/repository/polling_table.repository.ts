// src/polling_tables/polling_tables.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { PollingTableEntity } from '../model/polling_table.entity';
import { PollingTableCreateDto } from '../dto/polling_table_create.dto';
import { PollingTableUpdateDto } from '../dto/polling_table_update.dto';

@EntityRepository(PollingTableEntity)
export class PollingTablesRepository extends Repository<PollingTableEntity> {
  
  async createPollingTable(dto: PollingTableCreateDto): Promise<PollingTableEntity> {
    const pollingTable = this.create(dto);
    try {
      await this.save(pollingTable);
      return pollingTable;
    } catch (error) {
      throw new Error('Failed to create polling table: ' + error.message);
    }
  }

  async updatePollingTable(id: string, dto: PollingTableUpdateDto): Promise<PollingTableEntity> {
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

  async findPollingTableById(id: string): Promise<PollingTableEntity> {
    try {
      const pollingTable = await this.findOne(id);
      if (!pollingTable) {
        throw new Error('Polling table not found');
      }
      return pollingTable;
    } catch (error) {
      throw new Error('Failed to retrieve polling table: ' + error.message);
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
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No polling table found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete polling table: ' + error.message);
    }
  }
}
