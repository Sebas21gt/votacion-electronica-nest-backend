import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProposalCreateDto } from '../domain/dto/proposal_create.dto';
import { ProposalUpdateDto } from '../domain/dto/proposal_update.dto';
import { ProposalsRepository } from '../domain/repository/proposal.repository';

@Injectable()
export class ProposalsService {
    constructor(
        @InjectRepository(ProposalsRepository)
        private proposalsRepository: ProposalsRepository
    ) {}

    findAll() {
        return this.proposalsRepository.findAllProposals();
    }

    findAllByStudentFront(studentFrontId: string) {
        return this.proposalsRepository.findProposalsByStudentFront(studentFrontId);
    }

    findOne(id: string) {
        return this.proposalsRepository.findOneProposal(id);
    }

    create(dto: ProposalCreateDto) {
        return this.proposalsRepository.createProposal(dto);
    }

    update(id: string, dto: ProposalUpdateDto) {
        return this.proposalsRepository.updateProposal(id, dto);
    }

    remove(id: string) {
        return this.proposalsRepository.deleteProposal(id);
    }
}
