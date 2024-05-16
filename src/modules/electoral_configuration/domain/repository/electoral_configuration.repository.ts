import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { ElectoralConfigurationEntity } from '../model/electoral_configuration.entity';
import { ElectoralConfigurationCreateDto } from '../dto/electoral_configuration_create.dto';
import { ElectoralConfigurationUpdateDto } from '../dto/electoral_configuration_update.dto';

@Injectable()
export class ElectoralConfigurationRepository {
  constructor(
    @InjectRepository(ElectoralConfigurationEntity)
    private readonly repository: Repository<ElectoralConfigurationEntity>,
    @InjectRepository(CareerEntity)
    private readonly careerRepository: Repository<CareerEntity>
  ) {}

  async createElectoralConfiguration(dto: ElectoralConfigurationCreateDto) {
    const careers = await this.careerRepository.findByIds(dto.careersId);
    const entity = this.repository.create({
      ...dto,
      careers,
    });

    try {
      await this.repository.save(entity);
      return entity;
    } catch (e) {
      console.error(e);
      return new MessageResponse(HttpStatus.BAD_REQUEST, MessageEnum.ENTITY_ERROR_CREATE, 'Failed to create electoral configuration due to an error.');
    }
  }

  async updateElectoralConfiguration(id: string, dto: ElectoralConfigurationUpdateDto, updater: string) {
    const entity = await this.repository.findOne({ where: { id }, relations: ['careers'] });
    if (!entity) {
      return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.NOT_FOUND, 'Electoral configuration not found.');
    }

    const careers = await this.careerRepository.findByIds(dto.careersId);
    entity.careers = careers;
    this.repository.merge(entity, dto, { updateUser: updater });

    try {
      await this.repository.save(entity);
      return entity;
    } catch (e) {
      console.error(e);
      return new MessageResponse(HttpStatus.BAD_REQUEST, MessageEnum.ENTITY_ERROR_UPDATE, 'Failed to update electoral configuration due to an error.');
    }
  }

  async deleteElectoralConfiguration(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.repository.delete(id);
      if (deleteResult.affected === 0) {
        return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.NOT_FOUND, 'Electoral configuration not found or already deleted.');
      }
      return new MessageResponse(HttpStatus.OK, MessageEnum.USER_DELETE, 'Electoral configuration successfully deleted.');
    } catch (e) {
      console.error(e);
      return new MessageResponse(HttpStatus.BAD_REQUEST, MessageEnum.ENTITY_ERROR_DELETE, 'Failed to delete electoral configuration due to an error.');
    }
  }

  async getElectoralConfiguration(id: string): Promise<ElectoralConfigurationEntity | MessageResponse> {
    const entity = await this.repository.findOne({ where: { id }, relations: ['careers'] });
    if (!entity) {
      return new MessageResponse(HttpStatus.NOT_FOUND, MessageEnum.NOT_FOUND, 'Electoral configuration not found.');
    }
    return entity;
  }
}
