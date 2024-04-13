import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectoralConfigurationEntity } from '../model/electoral_configuration.entity';
import { ElectoralConfigurationCreateDto } from '../dto/electoral_configuration_create.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class ElectoralConfigurationRepository {
  constructor(
    @InjectRepository(ElectoralConfigurationEntity)
    private readonly repository: Repository<ElectoralConfigurationEntity>,
  ) {}

  async createElectoralConfiguration(
    dto: ElectoralConfigurationCreateDto,
    creator: string,
  ): Promise<MessageResponse | ElectoralConfigurationEntity> {
    const entity = this.repository.create(dto);
    entity.creationUser = creator;
    // entity.updateUser = creator;

    try {
      await this.repository.save(entity);
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create electoral configuration due to an error.',
      );
    }
    return entity;
  }

  async updateElectoralConfiguration(
    id: string,
    dto: ElectoralConfigurationCreateDto,
    updater: string,
  ): Promise<MessageResponse | ElectoralConfigurationEntity> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return new MessageResponse(
        HttpStatus.NOT_FOUND,
        MessageEnum.NOT_FOUND,
        'Electoral configuration not found.',
      );
    }
    this.repository.merge(entity, dto, { updateUser: updater });
    try {
      await this.repository.save(entity);
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update electoral configuration due to an error.',
      );
    }
    return entity;
  }

  async deleteElectoralConfiguration(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.repository.delete(id);
      if (deleteResult.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Electoral configuration not found or already deleted.',
        );
      }
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_DELETE,
        'Failed to delete electoral configuration due to an error.',
      );
    }
    return new MessageResponse(
      HttpStatus.OK,
      MessageEnum.USER_DELETE,
      'Electoral configuration successfully deleted.',
    );
  }
}
