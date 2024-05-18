// src/polling_tables/polling_tables.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollingTableEntity } from '../domain/model/polling_table.entity';
import { PollingTableCreateDto } from '../domain/dto/polling_table_create.dto';
import { PollingTablesRepository } from '../domain/repository/polling_table.repository';
import { PollingTableUpdateDto } from '../domain/dto/polling_table_update.dto';

@Injectable()
export class PollingTablesService {
    constructor(
        @InjectRepository(PollingTableEntity)
        private pollingTablesRepository: PollingTablesRepository,
    ) {}

    async create(createDto: PollingTableCreateDto): Promise<PollingTableEntity> {
        const pollingTable = this.pollingTablesRepository.create(createDto);
        return await this.pollingTablesRepository.save(pollingTable);
    }

    async findAll(): Promise<PollingTableEntity[]> {
        return await this.pollingTablesRepository.find();
    }

    async findOne(id: string): Promise<PollingTableEntity> {
        return await this.pollingTablesRepository.findOne(id);
    }

    async update(id: string, updateDto: PollingTableUpdateDto): Promise<PollingTableEntity> {
        const pollingTable = await this.pollingTablesRepository.preload({
            id: id,
            ...updateDto
        });
        if (!pollingTable) {
            throw new Error('Polling table not found');
        }
        return this.pollingTablesRepository.save(pollingTable);
    }

    async deletePollingTable(id: string): Promise<void> {
        await this.pollingTablesRepository.deletePollingTable(id);
    }
}
