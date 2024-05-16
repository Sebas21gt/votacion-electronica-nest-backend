// src/electoral-configuration/electoral-configuration.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ElectoralConfigurationService } from './electoral_configuration.service';
import { ElectoralConfigurationCreateDto } from '../domain/dto/electoral_configuration_create.dto';
import { ElectoralConfigurationUpdateDto } from '../domain/dto/electoral_configuration_update.dto';

@Controller('/electoral-configurations')
export class ElectoralConfigurationController {
  constructor(private readonly service: ElectoralConfigurationService) {}

  @Post('/create')
  create(@Body() dto: ElectoralConfigurationCreateDto) {
    return this.service.create(dto);
  }

  @Get('/getById/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() dto: ElectoralConfigurationUpdateDto, @Body('updater') updater: string) {
    return this.service.update(id, dto, updater);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
