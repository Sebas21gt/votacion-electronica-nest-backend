// src/proposals/repositories/proposals.repository.ts

import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { ProposalCreateDto } from '../dto/proposal_create.dto';
import { ProposalUpdateDto } from '../dto/proposal_update.dto';
import { ProposalsEntity } from '../model/proposal.entity';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';

@EntityRepository(ProposalsEntity)
export class ProposalsRepository extends Repository<ProposalsEntity> {
  async findAllProposals(): Promise<ProposalsEntity[] | MessageResponse> {
    try {
      return await this.find();
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve proposals.',
      );
    }
  }

  async findProposalsByStudentFront(
    studentFrontId: string,
  ): Promise<ProposalsEntity[] | MessageResponse> {
    try {
      return await this.find({
        where: { studentFront: { id: studentFrontId }, status: StatusEnum.Active },
        relations: ['studentFront']
      });
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve proposals.',
      );
    }
  }

  async findOneProposal(
    id: string,
  ): Promise<ProposalsEntity | MessageResponse> {
    try {
      const proposal = await this.findOne(id);
      if (!proposal) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Proposal not found.',
        );
      }
      return proposal;
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve the proposal.',
      );
    }
  }

  async createProposal(
    dto: ProposalCreateDto,
  ): Promise<ProposalsEntity | MessageResponse> {
    try {
      const proposal = this.create(dto);
      return await this.save(proposal);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create the proposal.',
      );
    }
  }

  async updateProposal(
    id: string,
    dto: ProposalUpdateDto,
  ): Promise<ProposalsEntity | MessageResponse> {
    try {
      const updateResult = await this.update(id, dto);
      if (updateResult.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Proposal not found to update.',
        );
      }
      return await this.findOneProposal(id);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update the proposal.',
      );
    }
  }

  async deleteProposal(id: string): Promise<MessageResponse> {
    try {
      const deleteResult = await this.delete(id);
      if (deleteResult.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          'Proposal not found to delete.',
        );
      }
      return new MessageResponse(
        HttpStatus.OK,
        MessageEnum.PROPOSAL_DELETE,
        'Proposal successfully deleted.',
      );
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_DELETE,
        'Failed to delete the proposal.',
      );
    }
  }
}
