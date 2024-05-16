// path/filename: src/careers/controllers/career.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { CareerService } from './career.service';
import { CareerEntity } from '../domain/model/career.entity';
import { CareerCreateDto } from '../domain/dto/career_create.dto';
import { CareerUpdateDto } from '../domain/dto/career_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';

@Controller('/careers')
export class CareerController {
  constructor(private careerService: CareerService) {}

  @Get('/get-careers')
  async getAllCareers(): Promise<CareerEntity[] | MessageResponse> {
    return await this.careerService.findAll();
  }

  @Get('/get-career/:id')
  async getCareerById(
    @Param('id') id: string,
  ): Promise<CareerEntity | MessageResponse> {
    return await this.careerService.findOne(id);
  }

  @Get('by-faculty/:facultyId')
  getCareersByFaculty(@Param('facultyId') facultyId: string) {
    return this.careerService.findCareersByFaculty(facultyId);
  }

  @Post('/create-career')
  async createCareer(@Body() careerDto: CareerCreateDto) {
    return this.careerService.create(careerDto);
  }

  @Put('/update-career/:id')
  async updateCareer(
    @Param('id') id: string,
    @Body() careerDto: CareerUpdateDto,
  ) {
    return this.careerService.update(id, careerDto);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete-career/:id')
  async removeCareer(@Param('id') id: string): Promise<void | MessageResponse> {
    const result = await this.careerService.remove(id);
    if (
      result instanceof MessageResponse &&
      result.statusCode !== HttpStatus.OK
    ) {
      throw new HttpException(result.message, result.statusCode);
    }
    return result;
  }
}
