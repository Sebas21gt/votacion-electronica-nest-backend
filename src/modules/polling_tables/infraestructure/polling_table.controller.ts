// src/polling_tables/polling_tables.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PollingTablesService } from './polling_table.service';
import { PollingTableCreateDto } from '../domain/dto/polling_table_create.dto';
import { PollingTableUpdateDto } from '../domain/dto/polling_table_update.dto';

@Controller('polling-tables')
export class PollingTablesController {
    constructor(private readonly pollingTablesService: PollingTablesService) {}

    @Post()
    create(@Body() createDto: PollingTableCreateDto) {
        return this.pollingTablesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.pollingTablesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pollingTablesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: PollingTableUpdateDto) {
        return this.pollingTablesService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pollingTablesService.remove(id);
    }
}
