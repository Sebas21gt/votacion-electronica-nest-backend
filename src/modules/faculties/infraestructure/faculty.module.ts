import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyEntity } from '../domain/model/faculty.entity';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { FacultyRepository } from '../domain/repository/faculty.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity, FacultyRepository])],
  providers: [FacultyService],
  controllers: [FacultyController],
  exports: [FacultyService],
})
export class FacultyModule {}
