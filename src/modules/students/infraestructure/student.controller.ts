import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './Student.service';
import { StudentCreateDto } from '../domain/dto/student_create.dto';
import { StudentUpdateDto } from '../domain/dto/student_update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { GlobalService } from 'src/modules/shared/global.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';

@Controller('/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create-student')
  createStudentWithUser(@Body() studentCreateDto: StudentCreateDto) {
    return this.studentService.createStudentWithUser(studentCreateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE,  RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-students')
  async findAllStudents() {
    const students = await this.studentService.findAllStudents();
    return students;
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-student/:id')
  findStudentById(@Param('id') id: string) {
    return this.studentService.findStudentById(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update-student/:id')
  updateStudent(@Param('id') id: string, @Body() studentDto: StudentUpdateDto) {
    return this.studentService.updateStudent(id, studentDto);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete-student/:id')
  removeStudent(@Param('id') id: string) {
    return this.studentService.removeStudent(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/import-students')
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return await this.studentService.importStudentsFromExcel(data);
  }
}
