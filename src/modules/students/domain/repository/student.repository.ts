import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../model/student.entity';
import { StudentCreateDto } from '../dto/student_create.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class StudentRepository {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly repository: Repository<StudentEntity>
    ) {}

    async createStudent(studentDto: StudentCreateDto, creator: string): Promise<MessageResponse | StudentEntity> {
        const student = this.repository.create(studentDto);
        student.creationUser = creator;
        // student.updateUser = creator;

        try {
            await this.repository.save(student);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_CREATE,
                "Failed to create student due to an error."
            );
        }
        return student;
    }

    async updateStudent(id: string, studentDto: StudentCreateDto, updater: string): Promise<MessageResponse | StudentEntity> {
        const student = await this.repository.findOne({ where: { id } });
        if (!student) {
            return new MessageResponse(
                HttpStatus.NOT_FOUND,
                MessageEnum.NOT_FOUND,
                "Student not found."
            );
        }
        this.repository.merge(student, studentDto, { updateUser: updater });
        try {
            await this.repository.save(student);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_UPDATE,
                "Failed to update student due to an error."
            );
        }
        return student;
    }
}
