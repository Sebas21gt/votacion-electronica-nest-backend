import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentController } from './student.controller';
import { StudentService } from './Student.service';
import { StudentsFrontRepository } from 'src/modules/students_fronts/domain/repository/student_front.repository';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { DataHashRepository } from 'src/modules/hashes/domain/repository/data_hash.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentRepository,
      StudentsFrontRepository,
      DelegatesRepository,
      UserRepository,
      DataHashRepository,
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, ContractService, DataHashService],
  exports: [StudentService],
})
export class StudentModule {}
