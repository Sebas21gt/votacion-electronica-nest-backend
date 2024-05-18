// src/electoral-configuration/electoral-configuration.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ElectoralConfigurationService } from './electoral_configuration.service';
import { ElectoralConfigurationCreateDto } from '../domain/dto/electoral_configuration_create.dto';
import { ElectoralConfigurationUpdateDto } from '../domain/dto/electoral_configuration_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/electoral-configurations')
export class ElectoralConfigurationController {
  constructor(private readonly service: ElectoralConfigurationService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Body() dto: ElectoralConfigurationCreateDto) {
    return this.service.create(dto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/getById/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  findAll() {
    return this.service.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() dto: ElectoralConfigurationUpdateDto, @Body('updater') updater: string) {
    return this.service.update(id, dto, updater);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
