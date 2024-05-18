// src/polling_tables/polling_tables.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PollingTablesService } from './polling_table.service';
import { PollingTableCreateDto } from '../domain/dto/polling_table_create.dto';
import { PollingTableUpdateDto } from '../domain/dto/polling_table_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/polling-tables')
export class PollingTablesController {
  constructor(private readonly pollingTablesService: PollingTablesService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Body() createDto: PollingTableCreateDto) {
    return this.pollingTablesService.create(createDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  findAll() {
    return this.pollingTablesService.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.pollingTablesService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateDto: PollingTableUpdateDto) {
    return this.pollingTablesService.update(id, updateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  deletePollingTable(@Param('id') id: string) {
    return this.pollingTablesService.deletePollingTable(id);
  }
}
