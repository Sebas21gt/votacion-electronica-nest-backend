import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentCreateDto } from '../domain/dto/student_create.dto';
import { StudentEntity } from '../domain/model/student.entity';
import { StudentUpdateDto } from '../domain/dto/student_update.dto';
import processExcelFile from '../domain/repository/read_excel';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentRepository)
        private studentRepository: StudentRepository
    ) {}

    createStudentWithUser(studentDto: StudentCreateDto): Promise<StudentEntity> {
        return this.studentRepository.createStudentWithUser(studentDto);
    }

    findAllStudents(): Promise<StudentEntity[]> {
        return this.studentRepository.find();
    }

    findStudentById(id: string): Promise<StudentEntity> {
        return this.studentRepository.findOneOrFail(id);
    }

    updateStudent(id: string, studentDto: StudentUpdateDto): Promise<StudentEntity> {
        return this.studentRepository.updateStudent(id, studentDto);
    }

    removeStudent(id: string): Promise<void> {
        return this.studentRepository.delete(id).then(result => {
            if (result.affected === 0) {
                throw new Error('No student found with the given id.');
            }
        });
    }

    async importStudentsFromExcel(data: any): Promise<StudentEntity[]> {
        return this.studentRepository.importStudentsFromExcel(data);
    }
}
