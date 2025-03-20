import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StudentPositionEntity } from '../model/student_position.entity';
import { StudentPositionCreateDto } from '../dto/student_position_create.dto';
import { StudentPositionUpdateDto } from '../dto/student_position_update.dto';

@EntityRepository(StudentPositionEntity)
export class StudentPositionRepository extends Repository<StudentPositionEntity> {
  async findAllPositions(): Promise<StudentPositionEntity[] | MessageResponse> {
    try {
      return await this.find();
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve positions.',
      );
    }
  }

  async findOnePosition(
    id: string,
  ): Promise<StudentPositionEntity | MessageResponse> {
    try {
      const position = await this.findOne(id);
      if (!position) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Position not found.',
        );
      }
      return position;
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve the position.',
      );
    }
  }

  async createPosition(
    dto: StudentPositionCreateDto,
  ): Promise<StudentPositionEntity | MessageResponse> {
    try {
      const position = this.create(dto);
      return await this.save(position);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create the position.',
      );
    }
  }

  async updatePosition(
    id: string,
    dto: StudentPositionUpdateDto,
  ): Promise<StudentPositionEntity | MessageResponse> {
    try {
      await this.update(id, dto);
      return await this.findOnePosition(id);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update the position.',
      );
    }
  }

  async deletePosition(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.delete(id);
      if (deleteResult.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Position not found to delete.',
        );
      }
      return new MessageResponse(
        HttpStatus.OK,
        MessageEnum.ENTITY_DELETE_SUCCESS,
        'Position successfully deleted.',
      );
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_DELETE,
        'Failed to delete the position.',
      );
    }
  }
}
