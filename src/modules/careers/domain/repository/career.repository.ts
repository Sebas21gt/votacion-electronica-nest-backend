// path/filename: src/careers/repositories/career.repository.ts

import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { CareerEntity } from '../model/career.entity';
import { CareerUpdateDto } from '../dto/career_update.dto';
import { CareerCreateDto } from '../dto/career_create.dto';

@EntityRepository(CareerEntity)
export class CareerRepository extends Repository<CareerEntity> {
  async createCareer(
    careerDto: CareerCreateDto,
  ): Promise<CareerEntity | MessageResponse> {
    const career = new CareerEntity();
    career.name = careerDto.name;
    career.collegeId = careerDto.collegeId;
    career.faculty = { id: careerDto.facultyId } as any;

    try {
      return await this.save(career);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create career.',
      );
    }
  }

  async updateCareer(
    id: string,
    careerDto: CareerUpdateDto,
  ): Promise<CareerEntity | MessageResponse> {
    try {
      const result = await this.update(id, { ...careerDto });
      if (result.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          `Career with ID ${id} not found.`,
        );
      }
      return await this.findOne(id);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update career.',
      );
    }
  }

  async findOneCareer(id: string): Promise<CareerEntity | MessageResponse> {
    try {
      const career = await this.findOne(id);
      if (!career) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          `Career with ID ${id} not found.`,
        );
      }
      return career;
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve career.',
      );
    }
  }

  async findAllCareers(): Promise<CareerEntity[] | MessageResponse> {
    try {
      return await this.find();
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve careers.',
      );
    }
  }

  async findCareersByFacultyId(
    facultyId: string,
  ): Promise<CareerEntity[] | MessageResponse> {
    try {
      const careers = await this.find({
        where: { faculty: { id: facultyId } },
        relations: ['faculty'],
      });
      return careers;
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve careers for the given faculty.',
      );
    }
  }

  async removeCareer(id: string): Promise<void | MessageResponse> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          `Career with ID ${id} not found.`,
        );
      }
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_DELETE,
        'Failed to delete career.',
      );
    }
  }
}
