import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyCreateDto } from '../domain/dto/faculty_create.dto';
import { FacultyUpdateDto } from '../domain/dto/faculty_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/faculties')
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-faculties')
  getAllFaculties() {
    return this.facultyService.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-faculty/:id')
  getFacultyById(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create-faculty')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createFaculty(@Body() facultyDto: FacultyCreateDto) {
    return this.facultyService.create(facultyDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update-faculty/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateFaculty(@Param('id') id: string, @Body() facultyDto: FacultyUpdateDto) {
    return this.facultyService.update(id, facultyDto);
  }
}
