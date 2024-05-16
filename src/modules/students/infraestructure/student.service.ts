import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentCreateDto } from '../domain/dto/student_create.dto';
import { StudentEntity } from '../domain/model/student.entity';
import { StudentUpdateDto } from '../domain/dto/student_update.dto';
import processExcelFile from '../domain/repository/read_excel';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentRepository)
    private studentRepository: StudentRepository,
  ) {}

  createStudentWithUser(studentDto: StudentCreateDto): Promise<StudentEntity> {
    return this.studentRepository.createStudentWithUser(studentDto);
  }

  findAllStudents(): Promise<StudentEntity[]> {
    return this.studentRepository.findAllStudents();
  }

  findStudentById(id: string): Promise<StudentEntity> {
    return this.studentRepository.findOneOrFail(id);
  }

  updateStudent(
    id: string,
    studentDto: StudentUpdateDto,
  ): Promise<StudentEntity> {
    return this.studentRepository.updateStudent(id, studentDto);
  }

  removeStudent(id: string): Promise<void> {
    return this.studentRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error('No student found with the given id.');
      }
    });
  }

  async importStudentsFromExcel(data: any): Promise<MessageResponse> {
    const errorStudents =
      await this.studentRepository.importStudentsFromExcel(data);
    if (errorStudents.length > 0) {
      return new MessageResponse(
        HttpStatus.PARTIAL_CONTENT,
        MessageEnum.ENTITY_ERROR_CREATE,
        errorStudents,
      );
    }
    return new MessageResponse(
      HttpStatus.OK,
      MessageEnum.STUDENT_CREATED,
      null,
    );
    // return this.studentRepository.importStudentsFromExcel(data);
  }
}
