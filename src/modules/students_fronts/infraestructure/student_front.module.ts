// path/filename: src/students-fronts/students-front.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsFrontEntity } from '../domain/model/student_front.entity';
import { StudentsFrontController } from './student_front.controller';
import { StudentsFrontRepository } from '../domain/repository/student_front.repository';
import { StudentsFrontService } from './student_front.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentsFrontEntity, StudentsFrontRepository])],
  controllers: [StudentsFrontController],
  providers: [StudentsFrontService],
  exports: [StudentsFrontService],
})
export class StudentsFrontModule {}
