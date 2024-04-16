import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsFrontService } from './student_front.service';

@Controller('/students-fronts')
export class StudentsFrontController {
  constructor(private studentsFrontService: StudentsFrontService) {}

  @Get('/get-students-fronts')
  findAll() {
    return this.studentsFrontService.findAll();
  }

  @Get('/get-student-front/:id')
  findOne(@Param('id') id: string) {
    return this.studentsFrontService.findOne(id);
  }

  @Post('/create-student-front')
  create(@Body() createDto: any) {
    return this.studentsFrontService.create(createDto);
  }

  @Put('/update-student-front/:id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.studentsFrontService.update(id, updateDto);
  }

  @Delete('/delete-student-front/:id')
  remove(@Param('id') id: string) {
    return this.studentsFrontService.remove(id);
  }
}
