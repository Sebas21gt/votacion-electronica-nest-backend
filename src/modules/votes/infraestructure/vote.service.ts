import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VotesRepository } from '../domain/repository/vote.repository';
import { VoteCreateDto } from '../domain/dto/vote_create.dto';
import { VotesEntity } from '../domain/model/vote.entity';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { keccak256, toUtf8Bytes } from 'ethers';
import { getManager } from 'typeorm';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VotesRepository)
    private votesRepository: VotesRepository,
    private readonly contractService: ContractService,
    private readonly dataHashService: DataHashService,
  ) {}

  async createVote(dto: VoteCreateDto, auth: string): Promise<boolean> {
    const userId = await JwtHelper.getUserIdJWT(auth);

    try {
      await getManager().transaction(async (transaction) => {
        const { student, frontId, pollingTable } =
          await this.votesRepository.createVote(transaction, dto, userId);

          const numberTable = pollingTable.numberTable;
          const hash = keccak256(toUtf8Bytes(student.id));
          const signatureHash = keccak256(toUtf8Bytes(dto.signature));
          const hashFront = keccak256(toUtf8Bytes(frontId.id));
          
        const contract_vote = await this.contractService.vote(hash, signatureHash, numberTable);
        const contract_result = await this.contractService.addFrontVote(hashFront);

        await this.dataHashService.createDataHash(transaction, contract_vote);
        await this.dataHashService.createDataHash(transaction, contract_result);
      });

      return true;
    } catch (error) {
      throw new HttpException(
        'Transaction failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
