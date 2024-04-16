import { Controller, Get, Post, Put, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyCreateDto } from '../domain/dto/faculty_create.dto';
import { FacultyUpdateDto } from '../domain/dto/faculty_update.dto';

@Controller('/faculties')
export class FacultyController {
    constructor(private facultyService: FacultyService) {}

    @Get('/get-faculties')
    getAllFaculties() {
        return this.facultyService.findAll();
    }

    @Get('/get-faculty/:id')
    getFacultyById(@Param('id') id: string) {
        return this.facultyService.findOne(id);
    }

    @Post('/create-faculty')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    createFaculty(@Body() facultyDto: FacultyCreateDto) {
        return this.facultyService.create(facultyDto);
    }

    @Put('/update-faculty/:id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateFaculty(@Param('id') id: string, @Body() facultyDto: FacultyUpdateDto) {
        return this.facultyService.update(id, facultyDto);
    }
}
