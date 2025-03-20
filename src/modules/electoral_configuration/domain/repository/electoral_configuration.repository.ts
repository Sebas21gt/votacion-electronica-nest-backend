import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { ElectoralConfigurationEntity } from '../model/electoral_configuration.entity';
import { ElectoralConfigurationCreateDto } from '../dto/electoral_configuration_create.dto';
import { ElectoralConfigurationUpdateDto } from '../dto/electoral_configuration_update.dto';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';

@Injectable()
export class ElectoralConfigurationRepository {
  constructor(
    @InjectRepository(ElectoralConfigurationEntity)
    private readonly repository: Repository<ElectoralConfigurationEntity>,
    @InjectRepository(CareerEntity)
    private readonly careerRepository: Repository<CareerEntity>,
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
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create electoral configuration due to an error.',
      );
    }
  }

  async updateElectoralConfiguration(
    id: string,
    dto: ElectoralConfigurationUpdateDto,
    updater: string,
  ) {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['careers'],
    });
    if (!entity) {
      return new MessageResponse(
        HttpStatus.NOT_FOUND,
        MessageEnum.NOT_FOUND,
        'Electoral configuration not found.',
      );
    }

    const careers = await this.careerRepository.findByIds(dto.careersId);
    entity.careers = careers;
    this.repository.merge(entity, dto, { updateUser: updater });

    try {
      await this.repository.save(entity);
      return entity;
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update electoral configuration due to an error.',
      );
    }
  }

  async deleteElectoralConfiguration(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.repository.findOne(id);
      deleteResult.status = StatusEnum.Deleted;
      await this.repository.save(deleteResult);

      if (!deleteResult) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Electoral configuration not found.',
        );
      }
      return new MessageResponse(
        HttpStatus.OK,
        MessageEnum.ELECTORAL_CONFIGURATION_DELETE,
        'Electoral configuration successfully deleted.',
      );
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.ELECTORAL_CONFIGURATION_ERROR_DELETE,
        'Failed to delete electoral configuration due to an error.',
      );
    }
  }

  async getElectoralConfiguration(id: string): Promise<any> {
    try {
      const configuration = await this.repository
        .createQueryBuilder('electoralConfiguration')
        .leftJoinAndSelect('electoralConfiguration.careers', 'careers')
        .select([
          'electoralConfiguration.electionDateStart',
          'electoralConfiguration.electionDateFinish',
          'electoralConfiguration.timeElection',
          'electoralConfiguration.numberTableElections',
          'careers.name',
        ])
        .where('electoralConfiguration.id = :id', { id })
        .andWhere('electoralConfiguration.status = :status', {
          status: StatusEnum.Active,
        })
        .getOne();

      if (!configuration) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Electoral configuration not found.',
        );
      }

      return {
        startDate: configuration.electionDateStart,
        finishDate: configuration.electionDateFinish,
        timeElection: configuration.timeElection,
        numberTableElections: configuration.numberTableElections,
        careers: configuration.careers.map((career) => career.name),
      };
    } catch (error) {
      console.error('Failed to retrieve electoral configuration:', error);
      throw new Error(
        'Failed to retrieve electoral configuration: ' + error.message,
      );
    }
  }

  async getAllElectoralConfigurations(): Promise<any[]> {
    try {
      const configurations = await this.repository
        .createQueryBuilder('electoralConfiguration')
        .leftJoinAndSelect('electoralConfiguration.careers', 'careers')
        .select([
          'electoralConfiguration.id',
          'electoralConfiguration.electionDateStart',
          'electoralConfiguration.electionDateFinish',
          'electoralConfiguration.timeElection',
          'electoralConfiguration.numberTableElections',
          'careers.name'
        ])
        .where('electoralConfiguration.status = :status', { status: StatusEnum.Active })
        .orderBy('electoralConfiguration.dateCreation', 'DESC')
        .getMany();

      return configurations.map(config => ({
        id: config.id,
        startDate: config.electionDateStart,
        finishDate: config.electionDateFinish,
        timeElection: config.timeElection,
        numberTableElections: config.numberTableElections,
        careers: config.careers.map(career => career.name)
      }));
    } catch (error) {
      console.error('Failed to retrieve all electoral configurations:', error);
      throw new Error('Failed to retrieve all electoral configurations: ' + error.message);
    }
  }
}
