import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataHashRepository } from '../domain/repository/data_hash.repository';
import { DataHashCreateDto } from '../domain/dto/create.dto';

@Injectable()
export class DataHashService {
  constructor(
    @InjectRepository(DataHashRepository)
    private dataHashRepository: DataHashRepository,
  ) {}

  async createDataHash(transaction: any, dto: DataHashCreateDto) {
    return await this.dataHashRepository.createDataHash(transaction, dto);
  }
}
