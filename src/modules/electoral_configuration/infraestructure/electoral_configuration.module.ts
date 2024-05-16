// src/electoral-configuration/electoral-configuration.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity'; // Ensure this import path is correct
import { ElectoralConfigurationEntity } from '../domain/model/electoral_configuration.entity';
import { ElectoralConfigurationController } from './electoral_configuration.controller';
import { ElectoralConfigurationRepository } from '../domain/repository/electoral_configuration.repository';
import { ElectoralConfigurationService } from './electoral_configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([ElectoralConfigurationEntity, CareerEntity])],
  controllers: [ElectoralConfigurationController],
  providers: [ElectoralConfigurationService, ElectoralConfigurationRepository]
})
export class ElectoralConfigurationModule {}
