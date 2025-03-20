import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StudentPositionService } from './student_position.service';
import { StudentPositionCreateDto } from '../domain/dto/student_position_create.dto';
import { StudentPositionUpdateDto } from '../domain/dto/student_position_update.dto';

@Controller('/student-positions')
export class StudentPositionController {
    constructor(private readonly positionService: StudentPositionService) {}

    @Get('/get-student-positions')
    findAll() {
        return this.positionService.findAll();
    }

    @Get('/get-student-position/:id')
    findOne(@Param('id') id: string) {
        return this.positionService.findOne(id);
    }

    @Post('/create-student-position')
    create(@Body() dto: StudentPositionCreateDto) {
        return this.positionService.create(dto);
    }

    @Put('/update-student-position/:id')
    update(@Param('id') id: string, @Body() dto: StudentPositionUpdateDto) {
        return this.positionService.update(id, dto);
    }

    @Delete('/delete-student-position/:id')
    remove(@Param('id') id: string) {
        return this.positionService.remove(id);
    }
}
