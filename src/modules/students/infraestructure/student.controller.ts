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

  @Post('/create-student')
  createStudentWithUser(@Body() studentCreateDto: StudentCreateDto) {
    return this.studentService.createStudentWithUser(studentCreateDto);
  }

  @Get('/get-students')
  findAllStudents() {
    return this.studentService.findAllStudents();
  }

  @Get('/get-student/:id')
  findStudentById(@Param('id') id: string) {
    return this.studentService.findStudentById(id);
  }

  @Put('/update-student/:id')
  updateStudent(@Param('id') id: string, @Body() studentDto: StudentUpdateDto) {
    return this.studentService.updateStudent(id, studentDto);
  }

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

        GlobalService.userSession = 'admin';

        return this.studentService.importStudentsFromExcel(data);
    }
}
