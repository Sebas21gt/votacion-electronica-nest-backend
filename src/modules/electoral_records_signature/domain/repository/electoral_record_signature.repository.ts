// src/electoral_record_signature/electoral_record_signature.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { ElectoralRecordSignatureEntity } from '../model/electoral_record_signature.entity';
import { ElectoralRecordSignatureCreateDto } from '../dto/electoral_record_signature_create.dto';
import { ElectoralRecordSignatureUpdateDto } from '../dto/electoral_record_signature_update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DelegatesEntity } from 'src/modules/delegates/domain/model/delegate.entity';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';

@EntityRepository(ElectoralRecordSignatureEntity)
export class ElectoralRecordSignatureRepository extends Repository<ElectoralRecordSignatureEntity> {
  async createSignature(
    dto: ElectoralRecordSignatureCreateDto,
  ): Promise<ElectoralRecordSignatureEntity> {
    const signature = new ElectoralRecordSignatureEntity();
    signature.electoralRecordId = { id: dto.electoralRecordId } as any;
    signature.userId = { id: dto.userId } as any;
    signature.signature = dto.signature;

    try {
      await this.save(signature);
      return signature;
    } catch (error) {
      throw new Error('Failed to create signature: ' + error.message);
    }
  }

  async findAllSignatures(): Promise<ElectoralRecordSignatureEntity[]> {
    try {
      return await this.find({ relations: ['electoralRecord', 'delegate'] });
    } catch (error) {
      throw new Error('Failed to retrieve signatures: ' + error.message);
    }
  }

  async findSignatureById(id: string): Promise<ElectoralRecordSignatureEntity> {
    try {
      const signature = await this.findOne(id, {
        relations: ['electoralRecord', 'delegate'],
      });
      if (!signature) {
        throw new Error('Signature not found');
      }
      return signature;
    } catch (error) {
      throw new Error('Failed to retrieve signature: ' + error.message);
    }
  }

  async updateSignature(
    id: string,
    dto: ElectoralRecordSignatureUpdateDto,
  ): Promise<ElectoralRecordSignatureEntity> {
    const signature = await this.preload({
      id: id,
      ...dto,
      signature: dto.signature,
    });
    if (!signature) {
      throw new Error('Signature not found');
    }
    try {
      await this.save(signature);
      return signature;
    } catch (error) {
      throw new Error('Failed to update signature: ' + error.message);
    }
  }

  async deleteSignature(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No signature found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete signature: ' + error.message);
    }
  }
}
