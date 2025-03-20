import { EntityRepository, Repository, getManager } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
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

      fronts.forEach((front) => {
        front.logo = front.logo.toString();
      }, this);

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

  async findOneStudentFront(frontId: string): Promise<any> {
    try {
      // Buscar detalles del frente estudiantil
      const frontDetails = await this.createQueryBuilder('front')
        .where('front.id = :frontId', { frontId })
        .andWhere('front.status = :status', { status: StatusEnum.Active })
        .select([
          'front.id',
          'front.name AS frontName',
          'front.logo AS frontLogo',
        ])
        .getRawOne();

      if (!frontDetails) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Student front not found.',
        );
      }

      // frontDetails.frontLogo = frontDetails.frontLogo.toString();

      // Buscar posiciones de estudiantes asociadas al frente
      const studentPositions = await this.createQueryBuilder('studentPosition')
        .innerJoin('studentPosition.student', 'student')
        .innerJoin('studentPosition.front', 'front')
        .select([
          'student.fullname AS studentName',
          'student.ciNumber AS studentCI',
          'studentPosition.position_name AS positionName',
          'studentPosition.position_description AS positionDescription',
        ])
        .where('studentPosition.frontId = :frontId', { frontId })
        .andWhere('studentPosition.status = :status', {
          status: StatusEnum.Active,
        })
        .getRawMany();

      // Buscar propuestas asociadas al frente
      const proposals = await this.createQueryBuilder('proposal')
        .where('proposal.studentFrontId = :frontId', { frontId })
        .andWhere('proposal.status = :status', { status: StatusEnum.Active })
        .select(['proposal.description'])
        .getRawMany();

      // Combinar los resultados
      return {
        ...frontDetails,
        studentPositions,
        proposals,
      };
    } catch (error) {
      console.error('Failed to retrieve student front details:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve student front details.',
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
      const deleteResult = await this.update(id, {
        status: StatusEnum.Deleted,
      });
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
