import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataHashRepository } from '../domain/repository/data_hash.repository';
import { DataHashService } from './hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataHashRepository])],
  controllers: [],
  providers: [DataHashService],
  exports: [DataHashService],
})
export class DataHashModule {}
