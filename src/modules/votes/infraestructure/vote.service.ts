import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VotesRepository } from '../domain/repository/vote.repository';
import { VoteCreateDto } from '../domain/dto/vote_create.dto';
import { VotesEntity } from '../domain/model/vote.entity';
import { VoteUpdateDto } from '../domain/dto/vote_update.dto';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';

@Injectable()
export class VotesService {
    constructor(
        @InjectRepository(VotesRepository)
        private votesRepository: VotesRepository,
    ) {}

    async createVote(dto: VoteCreateDto, auth: string): Promise<boolean> {
        const userId = await JwtHelper.getUserIdJWT(auth);
        return await this.votesRepository.createVote(dto, userId);
    }

    async findAllVotes(): Promise<VotesEntity[]> {
        return await this.votesRepository.findAllVotes();
    }

    async findVoteById(id: string): Promise<VotesEntity> {
        return await this.votesRepository.findVoteById(id);
    }

    async deleteVote(id: string): Promise<void> {
        await this.votesRepository.deleteVote(id);
    }
}
