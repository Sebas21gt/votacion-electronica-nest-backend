import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ElectoralRecordService } from './electoral_record.service';
import { ElectoralRecordCreateDto } from '../domain/dto/electoral_record_create.dto';
import { ElectoralRecordUpdateDto } from '../domain/dto/electoral_record_update.dto';

@Controller('electoral-records')
export class ElectoralRecordController {
  constructor(private readonly service: ElectoralRecordService) {}

  @Post()
  create(@Body() dto: ElectoralRecordCreateDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ElectoralRecordUpdateDto, @Body('updater') updater: string) {
    return this.service.update(id, dto, updater);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
