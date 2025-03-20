import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentsFrontRepository } from '../domain/repository/student_front.repository';
import { ResultsRepository } from 'src/modules/results/domain/repository/result.repository';

@Injectable()
export class StudentsFrontService {
    constructor(
        @InjectRepository(StudentsFrontRepository)
        private studentsFrontRepository: StudentsFrontRepository,
        // private resultsRepository: ResultsRepository
    ) {}

    async findAll() {
        return await this.studentsFrontRepository.findAllStudentsFronts();
    }

    findOne(id: string) {
        return this.studentsFrontRepository.findOneStudentFront(id);
    }

    create(createDto: any) {
        return this.studentsFrontRepository.createStudentFront(createDto);
    }

    async update(id: string, updateDto: any) {
        return await this.studentsFrontRepository.updateStudentFront(id, updateDto);
    }

    async remove(id: string) {
        return  await this.studentsFrontRepository.deleteStudentFront(id);
    }
}
