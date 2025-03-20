import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultsRepository } from '../domain/repository/result.repository';
import { ResultCreateDto } from '../domain/dto/result_create.dto';
import { ResultsEntity } from '../domain/model/result.entity';
import { ResultUpdateDto } from '../domain/dto/result_update.dto';

@Injectable()
export class ResultsService {
    constructor(
        @InjectRepository(ResultsRepository)
        private resultsRepository: ResultsRepository,
    ) {}

    async createResult(dto: ResultCreateDto): Promise<ResultsEntity> {
        return await this.resultsRepository.createResult(dto);
    }

    async findAllResults(): Promise<ResultsEntity[]> {
        return await this.resultsRepository.findAllResults();
    }

    async findResultById(id: string): Promise<ResultsEntity> {
        return await this.resultsRepository.findResultById(id);
    }

    async updateResult(id: string, dto: ResultUpdateDto): Promise<ResultsEntity> {
        return await this.resultsRepository.updateResult(id, dto);
    }

    async deleteResult(id: string): Promise<void> {
        await this.resultsRepository.deleteResult(id);
    }
}
