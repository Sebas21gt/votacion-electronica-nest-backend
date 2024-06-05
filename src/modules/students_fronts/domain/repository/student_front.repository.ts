import { EntityRepository, Repository, getManager } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StudentsFrontEntity } from '../model/student_front.entity';
import { StudentsFrontCreateDto } from '../dto/student_front_create.dto';
import { StudentsFrontUpdateDto } from '../dto/student_front_update.dto';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { ResultsEntity } from 'src/modules/results/domain/model/result.entity';

@EntityRepository(StudentsFrontEntity)
export class StudentsFrontRepository extends Repository<StudentsFrontEntity> {
  async findAllStudentsFronts(): Promise<
    StudentsFrontEntity[] | MessageResponse
  > {
    try {
        const fronts = await this.find({
          where: { status: StatusEnum.Active },
        });

        return fronts;
      } catch (error) {
        console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve students fronts.',
      );
    }
  }

  async findOneStudentFront(
    id: string,
  ): Promise<StudentsFrontEntity | MessageResponse> {
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

  async createStudentFront(
    studentFrontDto: StudentsFrontCreateDto,
  ): Promise<StudentsFrontEntity | MessageResponse> {
    let studentFront = new StudentsFrontEntity();
    await getManager().transaction(async (transactionalEntityManager) => {
      studentFront = await transactionalEntityManager.findOne(
        StudentsFrontEntity,
        {
          where: {
            name: studentFrontDto.name,
            acronym: studentFrontDto.acronym,
          },
        },
      );

      if (studentFront) {
        throw new HttpException(
          'Student front already exists.',
          HttpStatus.CONFLICT,
        );
      }

      studentFront = new StudentsFrontEntity();
      Object.assign(studentFront, studentFrontDto);

      // studentFront.logo = studentFrontDto.logo;

      await transactionalEntityManager.save(StudentsFrontEntity, studentFront);

      const result = new ResultsEntity();
      //TODO: Obtener el id de la eleccion actual en el service
      result.electoralRecordId = 'b6396e22-82da-4a16-86ac-4c28701abc83';
      result.studentFrontId = studentFront.id;
      result.votes = 0;

      await transactionalEntityManager.save(ResultsEntity, result);
    });

    return studentFront;
  }

  async updateStudentFront(
    id: string,
    updateDto: StudentsFrontUpdateDto,
  ): Promise<StudentsFrontEntity | MessageResponse> {
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
