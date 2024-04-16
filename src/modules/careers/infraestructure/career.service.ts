import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { CareerRepository } from '../domain/repository/career.repository';
import { CareerEntity } from '../domain/model/career.entity';
import { CareerCreateDto } from '../domain/dto/career_create.dto';
import { CareerUpdateDto } from '../domain/dto/career_update.dto';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(CareerRepository)
    private careerRepository: CareerRepository,
  ) {}

  async findAll(): Promise<CareerEntity[] | MessageResponse> {
    return this.careerRepository.findAllCareers();
  }

  async findOne(id: string): Promise<CareerEntity | MessageResponse> {
    return this.careerRepository.findOneCareer(id);
  }

  async findCareersByFaculty(
    facultyId: string,
  ): Promise<CareerEntity[] | MessageResponse> {
    return this.careerRepository.findCareersByFacultyId(facultyId);
  }

  create(careerDto: CareerCreateDto): Promise<CareerEntity | MessageResponse> {
    return this.careerRepository.createCareer(careerDto);
  }

  update(
    id: string,
    careerDto: CareerUpdateDto,
  ): Promise<CareerEntity | MessageResponse> {
    return this.careerRepository.updateCareer(id, careerDto);
  }

  async remove(id: string): Promise<void | MessageResponse> {
    return this.careerRepository.removeCareer(id);
  }
}
