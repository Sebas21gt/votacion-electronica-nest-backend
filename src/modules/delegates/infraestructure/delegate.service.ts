// src/delegates/delegates.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DelegatesEntity } from '../domain/model/delegate.entity';
import { DelegatesRepository } from '../domain/repository/delegate.repository';
import { DelegateCreateDto } from '../domain/dto/delegate_create.dto';

@Injectable()
export class DelegatesService {
    constructor(
        @InjectRepository(DelegatesRepository)
        private delegatesRepository: DelegatesRepository,
    ) {}

    async createDelegate(delegate: DelegateCreateDto): Promise<DelegatesEntity> {
        const result = await this.delegatesRepository.createDelegate(delegate);
        return result;
    }

    async findAll(): Promise<DelegatesEntity[]> {
        return await this.delegatesRepository.find();
    }

    async findOne(id: string): Promise<DelegatesEntity> {
        return await this.delegatesRepository.findOne(id);
    }

    async update(id: string, delegate: Partial<DelegatesEntity>): Promise<DelegatesEntity> {
        await this.delegatesRepository.update(id, delegate);
        return this.delegatesRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.delegatesRepository.delete(id);
    }
}
