import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StudentsFrontEntity } from '../model/student_front.entity';
import { StudentsFrontCreateDto } from '../dto/student_front_create.dto';
import { StudentsFrontUpdateDto } from '../dto/student_front_update.dto';

@EntityRepository(StudentsFrontEntity)
export class StudentsFrontRepository extends Repository<StudentsFrontEntity> {
    async findAllStudentsFronts(): Promise<StudentsFrontEntity[] | MessageResponse> {
        try {
            return await this.find();
        } catch (error) {
            console.error(error);
            return new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MessageEnum.ENTITY_ERROR_RETRIEVE,
                'Failed to retrieve students fronts.',
            );
        }
    }

    async findOneStudentFront(id: string): Promise<StudentsFrontEntity | MessageResponse> {
        try {
            const studentFront = await this.findOne(id);
            if (!studentFront) {
                return new MessageResponse(
                    HttpStatus.NOT_FOUND,
                    MessageEnum.NOT_FOUND,
                    'Student front not found.',
                );
            }
            return studentFront;
        } catch (error) {
            console.error(error);
            return new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MessageEnum.ENTITY_ERROR_RETRIEVE,
                'Failed to retrieve the student front.',
            );
        }
    }

    async createStudentFront(studentFrontDto: StudentsFrontCreateDto): Promise<StudentsFrontEntity | MessageResponse> {
        try {
            const studentFront = this.create(studentFrontDto);
            studentFront.creationUser = 'admin';
            return await this.save(studentFront);
        } catch (error) {
            console.error(error);
            return new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MessageEnum.ENTITY_ERROR_CREATE,
                'Failed to create the student front.',
            );
        }
    }

    async updateStudentFront(id: string, updateDto: StudentsFrontUpdateDto): Promise<StudentsFrontEntity | MessageResponse> {
        try {
            const updateResult = await this.update(id, updateDto);
            if (updateResult.affected === 0) {
                return new MessageResponse(
                    HttpStatus.NOT_FOUND,
                    MessageEnum.NOT_FOUND,
                    'Student front not found to update.',
                );
            }
            return await this.findOneStudentFront(id);
        } catch (error) {
            console.error(error);
            return new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MessageEnum.ENTITY_ERROR_UPDATE,
                'Failed to update the student front.',
            );
        }
    }

    async deleteStudentFront(id: string): Promise<MessageResponse> {
        try {
            const deleteResult = await this.delete(id);
            if (deleteResult.affected === 0) {
                return new MessageResponse(
                    HttpStatus.NOT_FOUND,
                    MessageEnum.NOT_FOUND,
                    'Student front not found to delete.',
                );
            }
            return new MessageResponse(
                HttpStatus.OK,
                MessageEnum.STUDENT_FRONT_DELETE,
                'Student front successfully deleted.',
            );
        } catch (error) {
            console.error(error);
            return new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MessageEnum.ENTITY_ERROR_DELETE,
                'Failed to delete the student front.',
            );
        }
    }
}
