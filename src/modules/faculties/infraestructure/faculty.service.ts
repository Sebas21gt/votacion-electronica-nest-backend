// path/filename: src/faculties/services/faculty.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { FacultyRepository } from '../domain/repository/faculty.repository';
import { FacultyEntity } from '../domain/model/faculty.entity';
import { FacultyCreateDto } from '../domain/dto/faculty_create.dto';
import { FacultyUpdateDto } from '../domain/dto/faculty_update.dto';

@Injectable()
export class FacultyService {
    constructor(
        @InjectRepository(FacultyRepository)
        private facultyRepository: FacultyRepository
    ) {}

    findAll(): Promise<FacultyEntity[] | MessageResponse> {
        return this.facultyRepository.findAllFaculties();
    }

    findOne(id: string): Promise<FacultyEntity | MessageResponse> {
        return this.facultyRepository.findOneFaculty(id);
    }

    create(facultyDto: FacultyCreateDto): Promise<FacultyEntity | MessageResponse> {
        return this.facultyRepository.createFaculty(facultyDto);
    }

    update(id: string, facultyDto: FacultyUpdateDto): Promise<FacultyEntity | MessageResponse> {
        return this.facultyRepository.updateFaculty(id, facultyDto);
    }
}
