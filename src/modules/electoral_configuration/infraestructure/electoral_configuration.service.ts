import { Injectable } from '@nestjs/common';
import { ElectoralConfigurationRepository } from '../domain/repository/electoral_configuration.repository';
import { ElectoralConfigurationCreateDto } from '../domain/dto/electoral_configuration_create.dto';
import { ElectoralConfigurationUpdateDto } from '../domain/dto/electoral_configuration_update.dto';

@Injectable()
export class ElectoralConfigurationService {
  constructor(private readonly electoralConfigurationRepo: ElectoralConfigurationRepository) {}

  create(dto: ElectoralConfigurationCreateDto) {
    return this.electoralConfigurationRepo.createElectoralConfiguration(dto);
  }

  update(id: string, dto: ElectoralConfigurationUpdateDto, updater: string) {
    return this.electoralConfigurationRepo.updateElectoralConfiguration(id, dto, updater);
  }

  delete(id: string) {
    return this.electoralConfigurationRepo.deleteElectoralConfiguration(id);
  }

  findOne(id: string) {
    return this.electoralConfigurationRepo.getElectoralConfiguration(id);
  }
}
