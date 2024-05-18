// src/delegates/delegates.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegatesEntity } from '../domain/model/delegate.entity';
import { DelegatesRepository } from '../domain/repository/delegate.repository';
import { DelegatesService } from './delegate.service';
import { DelegatesController } from './delegate.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DelegatesEntity,DelegatesRepository])],
    providers: [DelegatesService],
    controllers: [DelegatesController],
    exports: [DelegatesService],
})
export class DelegatesModule {}
