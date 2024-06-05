import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentController } from './student.controller';
import { StudentService } from './Student.service';
import { StudentsFrontRepository } from 'src/modules/students_fronts/domain/repository/student_front.repository';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentRepository,
      StudentsFrontRepository,
      DelegatesRepository,
      UserRepository
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
