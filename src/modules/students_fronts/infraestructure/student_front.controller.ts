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
  findAll() {
    return this.studentsFrontService.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.studentsFrontService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Body() createDto: any) {
    return this.studentsFrontService.create(createDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.studentsFrontService.update(id, updateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.studentsFrontService.remove(id);
  }
}
