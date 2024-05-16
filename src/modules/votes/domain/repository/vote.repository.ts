import { EntityRepository, Repository } from 'typeorm';
import { VoteCreateDto } from '../dto/vote_create.dto';
import { VotesEntity } from '../model/vote.entity';

@EntityRepository(VotesEntity)
export class VotesRepository extends Repository<VotesEntity> {
  async createVote(dto: VoteCreateDto): Promise<VotesEntity> {
    const vote = this.create({
      student: { id: dto.studentId } as any,
      pollingTable: { id: dto.pollingTableId } as any,
    });
    try {
      await this.save(vote);
      return vote;
    } catch (error) {
      throw new Error('Failed to create vote: ' + error.message);
    }
  }

  async findAllVotes(): Promise<VotesEntity[]> {
    try {
      return await this.find({ relations: ['student', 'pollingTable'] });
    } catch (error) {
      throw new Error('Failed to retrieve votes: ' + error.message);
    }
  }

  async findVoteById(id: string): Promise<VotesEntity> {
    try {
      const vote = await this.findOne(id, {
        relations: ['student', 'pollingTable'],
      });
      if (!vote) {
        throw new Error('Vote not found');
      }
      return vote;
    } catch (error) {
      throw new Error('Failed to retrieve vote: ' + error.message);
    }
  }

  async updateVote(id: string, dto: VoteCreateDto): Promise<VotesEntity> {
    const vote = await this.preload({
      id: id,
      student: { id: dto.studentId } as any,
      pollingTable: { id: dto.pollingTableId } as any,
    });
    if (!vote) {
      throw new Error('Vote not found');
    }
    try {
      await this.save(vote);
      return vote;
    } catch (error) {
      throw new Error('Failed to update vote: ' + error.message);
    }
  }

  async deleteVote(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No vote found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete vote: ' + error.message);
    }
  }
}
