import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentsFrontRepository } from '../domain/repository/student_front.repository';

@Injectable()
export class StudentsFrontService {
    constructor(
        @InjectRepository(StudentsFrontRepository)
        private studentsFrontRepository: StudentsFrontRepository
    ) {}

    findAll() {
        return this.studentsFrontRepository.findAllStudentsFronts();
    }

    findOne(id: string) {
        return this.studentsFrontRepository.findOneStudentFront(id);
    }

    create(createDto: any) {
        return this.studentsFrontRepository.createStudentFront(createDto);
    }

    update(id: string, updateDto: any) {
        return this.studentsFrontRepository.updateStudentFront(id, updateDto);
    }

    remove(id: string) {
        return this.studentsFrontRepository.deleteStudentFront(id);
    }
}
