import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerRepository } from '../domain/repository/career.repository';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { CareerEntity } from '../domain/model/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareerEntity, CareerRepository])],
  providers: [CareerService],
  controllers: [CareerController],
  exports: [CareerService],
})
export class CareerModule {}
