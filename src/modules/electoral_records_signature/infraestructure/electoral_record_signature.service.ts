// src/electoral_record_signature/electoral_record_signature.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElectoralRecordSignatureRepository } from '../domain/repository/electoral_record_signature.repository';
import { ElectoralRecordSignatureCreateDto } from '../domain/dto/electoral_record_signature_create.dto';
import { ElectoralRecordSignatureEntity } from '../domain/model/electoral_record_signature.entity';
import { ElectoralRecordSignatureUpdateDto } from '../domain/dto/electoral_record_signature_update.dto';

@Injectable()
export class ElectoralRecordSignatureService {
    constructor(
        @InjectRepository(ElectoralRecordSignatureRepository)
        private readonly signatureRepository: ElectoralRecordSignatureRepository,
    ) {}

    async createSignature(dto: ElectoralRecordSignatureCreateDto): Promise<ElectoralRecordSignatureEntity> {
        return this.signatureRepository.createSignature(dto);
    }

    async findAllSignatures(): Promise<ElectoralRecordSignatureEntity[]> {
        return this.signatureRepository.findAllSignatures();
    }

    async findSignatureById(id: string): Promise<ElectoralRecordSignatureEntity> {
        return this.signatureRepository.findSignatureById(id);
    }

    async updateSignature(id: string, dto: ElectoralRecordSignatureUpdateDto): Promise<ElectoralRecordSignatureEntity> {
        return this.signatureRepository.updateSignature(id, dto);
    }

    async deleteSignature(id: string): Promise<void> {
        return this.signatureRepository.deleteSignature(id);
    }
}
