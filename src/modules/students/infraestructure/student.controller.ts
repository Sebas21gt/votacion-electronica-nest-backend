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
} from '@nestjs/common';
import { StudentService } from './Student.service';
import { StudentCreateDto } from '../domain/dto/student_create.dto';
import { StudentUpdateDto } from '../domain/dto/student_update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

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

  @Post('/import-students')
    @UseInterceptors(FileInterceptor('file'))
    async importStudents(@UploadedFile() file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        return this.studentService.importStudentsFromExcel(data);
    }
}
