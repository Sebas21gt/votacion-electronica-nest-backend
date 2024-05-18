// src/electoral-record/electoral-record.service.ts
import { Injectable } from '@nestjs/common';
import { ElectoralRecordRepository } from '../domain/repository/electoral_record.repository';
import { ElectoralRecordCreateDto } from '../domain/dto/electoral_record_create.dto';
import { ElectoralRecordUpdateDto } from '../domain/dto/electoral_record_update.dto';

@Injectable()
export class ElectoralRecordService {
  constructor(private electoralRecordRepo: ElectoralRecordRepository) {}

  create(dto: ElectoralRecordCreateDto) {
    return this.electoralRecordRepo.createElectoralRecord(dto);
  }

  update(id: string, dto: ElectoralRecordUpdateDto) {
    return this.electoralRecordRepo.updateElectoralRecord(id, dto);
  }

  delete(id: string) {
    return this.electoralRecordRepo.deleteElectoralRecord(id);
  }

  findOne(id: string) {
    return this.electoralRecordRepo.findOne({ where: { id } });
  }

  findAll() {
    return this.electoralRecordRepo.findAllElectoralRecords();
  }
}
