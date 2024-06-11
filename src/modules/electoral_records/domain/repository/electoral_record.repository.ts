import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { ElectoralRecordEntity } from '../model/electoral_record.entity';
import { ElectoralRecordCreateDto } from '../dto/electoral_record_create.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';

@EntityRepository(ElectoralRecordEntity)
export class ElectoralRecordRepository extends Repository<ElectoralRecordEntity>{

  async createElectoralRecord(
    dto: ElectoralRecordCreateDto,
  ): Promise<MessageResponse | ElectoralRecordEntity> {
    const entity = this.create(dto);

    try {
      await this.save(entity);
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create electoral record due to an error.',
      );
    }
    return entity;
  }

  async updateElectoralRecord(
    id: string,
    electoralRecord: ElectoralRecordEntity
  ): Promise<MessageResponse | ElectoralRecordEntity> {
    const entity = await this.findOne({ where: { id } });
    if (!entity) {
      return new MessageResponse(
        HttpStatus.NOT_FOUND,
        MessageEnum.NOT_FOUND,
        'Electoral record not found.',
      );
    }
    try {
      await this.update(entity, electoralRecord);
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update electoral record due to an error.',
      );
    }
    return entity;
  }

  async deleteElectoralRecord(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.delete(id);
      if (deleteResult.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Electoral record not found or already deleted.',
        );
      }
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_DELETE,
        'Failed to delete electoral record due to an error.',
      );
    }
    return new MessageResponse(
      HttpStatus.OK,
      MessageEnum.USER_DELETE,
      'Electoral record successfully deleted.',
    );
  }

  async findOneElectoral(): Promise<ElectoralRecordEntity> {
    return this.findOne({where: { status: StatusEnum.Active }});
  }

  async findAllElectoralRecords(): Promise<ElectoralRecordEntity[]> {
    return this.find();
  }
}
