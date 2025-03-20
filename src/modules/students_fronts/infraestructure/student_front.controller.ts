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
import { StudentsFrontService } from './student_front.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/students-fronts')
export class StudentsFrontController {
  constructor(private studentsFrontService: StudentsFrontService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  async findAll() {
    return await this.studentsFrontService.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get/:id')
  async findOne(@Param('id') id: string) {
    return await this.studentsFrontService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  async create(@Body() createDto: any) {
    return await this.studentsFrontService.create(createDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.studentsFrontService.update(id, updateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.studentsFrontService.remove(id);
  }
}
