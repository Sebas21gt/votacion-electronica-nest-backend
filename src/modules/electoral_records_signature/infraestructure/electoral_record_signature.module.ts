// src/electoral_record_signature/electoral_record_signature.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectoralRecordSignatureService } from './electoral_record_signature.service';
import { ElectoralRecordSignatureController } from './electoral_record_signature.controller';
import { ElectoralRecordSignatureRepository } from '../domain/repository/electoral_record_signature.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ElectoralRecordSignatureRepository])],
    controllers: [ElectoralRecordSignatureController],
    providers: [ElectoralRecordSignatureService],
    exports: [ElectoralRecordSignatureService],
})
export class ElectoralRecordSignatureModule {}
