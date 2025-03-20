// src/proposals/proposals.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsEntity } from '../domain/model/proposal.entity';
import { ProposalsController } from './proposal.controller';
import { ProposalsService } from './proposal.service';
import { ProposalsRepository } from '../domain/repository/proposal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalsEntity, ProposalsRepository])],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
