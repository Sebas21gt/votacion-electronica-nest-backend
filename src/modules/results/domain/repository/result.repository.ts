import { EntityRepository, Repository } from 'typeorm';
import { ResultCreateDto } from '../dto/result_create.dto';
import { ResultsEntity } from '../model/result.entity';

@EntityRepository(ResultsEntity)
export class ResultsRepository extends Repository<ResultsEntity> {
  
  async createResult(dto: ResultCreateDto): Promise<ResultsEntity> {
    const result = this.create({
      electoralRecord: { id: dto.electoralRecordId } as any,
      studentFront: { id: dto.studentFrontId } as any,
      votes: dto.votes
    });
    try {
      await this.save(result);
      return result;
    } catch (error) {
      throw new Error('Failed to create result: ' + error.message);
    }
  }

  async updateResult(id: string, dto: ResultCreateDto): Promise<ResultsEntity> {
    const result = await this.preload({
      id: id,
      ...dto
    });
    if (!result) {
      throw new Error('Result not found');
    }
    try {
      await this.save(result);
      return result;
    } catch (error) {
      throw new Error('Failed to update result: ' + error.message);
    }
  }

  async findAllResults(): Promise<ResultsEntity[]> {
    try {
      return await this.find({ relations: ['electoralRecord', 'studentFront'] });
    } catch (error) {
      throw new Error('Failed to retrieve results: ' + error.message);
    }
  }

  async findResultById(id: string): Promise<ResultsEntity> {
    try {
      const result = await this.findOne(id, { relations: ['electoralRecord', 'studentFront'] });
      if (!result) {
        throw new Error('Result not found');
      }
      return result;
    } catch (error) {
      throw new Error('Failed to retrieve result: ' + error.message);
    }
  }

  async deleteResult(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No result found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete result: ' + error.message);
    }
  }
}
