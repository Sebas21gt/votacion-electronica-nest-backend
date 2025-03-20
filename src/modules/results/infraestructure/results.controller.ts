import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultCreateDto } from '../domain/dto/result_create.dto';
import { ResultUpdateDto } from '../domain/dto/result_update.dto';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) {}

    @Post()
    create(@Body() createDto: ResultCreateDto) {
        return this.resultsService.createResult(createDto);
    }

    @Get('/all')
    findAll() {
        return this.resultsService.findAllResults();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resultsService.findResultById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: ResultUpdateDto) {
        return this.resultsService.updateResult(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.resultsService.deleteResult(id);
    }
}
