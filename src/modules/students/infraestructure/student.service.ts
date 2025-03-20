import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentCreateDto } from '../domain/dto/student_create.dto';
import { StudentEntity } from '../domain/model/student.entity';
import { StudentUpdateDto } from '../domain/dto/student_update.dto';
import processExcelFile from '../domain/repository/read_excel';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StudentsFrontRepository } from 'src/modules/students_fronts/domain/repository/student_front.repository';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { keccak256, toUtf8Bytes } from 'ethers';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { DataHashCreateDto } from 'src/modules/hashes/domain/dto/create.dto';
import { getManager } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentRepository)
    private studentRepository: StudentRepository,
    private studentFrontRepository: StudentsFrontRepository,
    private delegateRepository: DelegatesRepository,
    private userRepository: UserRepository,
    private readonly contractService: ContractService,
    private readonly dataHashService: DataHashService,
  ) {}

  async createStudentWithUser(
    studentDto: StudentCreateDto,
  ): Promise<StudentEntity> {
    let student: StudentEntity;
    await getManager().transaction(async (transaction) => {
      student = await this.studentRepository.createStudentWithUser(
        transaction,
        studentDto,
      );
      const hash = keccak256(toUtf8Bytes(student.id));
      const contract = await this.contractService.addStudent(hash);
      await this.dataHashService.createDataHash(transaction, contract);
    });
    return student;
  }

  findAllStudents(): Promise<StudentEntity[]> {
    return this.studentRepository.findAllStudents();
  }

  findStudentById(id: string): Promise<StudentEntity> {
    return this.studentRepository.findOneStudent(id);
  }

  async enableStudent(id: string, auth: string): Promise<StudentEntity> {
    const totalFronts = await this.studentFrontRepository.count({
      where: { status: StatusEnum.Active },
    });
    const userId = await JwtHelper.getUserIdJWT(auth);
    console.log(userId);
    const user = await this.userRepository.findOne(userId, {
      where: { status: StatusEnum.Active },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const student = await this.studentRepository.findOne({
      userId: user.id,
      status: StatusEnum.Active,
    });
    if (!student) {
      throw new HttpException('Student not found.', HttpStatus.NOT_FOUND);
    }

    const delegate = await this.delegateRepository.findOne({
      where: { studentId: student.id, status: StatusEnum.Active },
    });

    if (!delegate) {
      throw new Error('Delegate not found.');
    }

    return this.studentRepository.enableStudent(
      id,
      totalFronts,
      delegate.pollingTableId,
    );
  }

  updateStudent(
    id: string,
    studentDto: StudentUpdateDto,
  ): Promise<StudentEntity> {
    return this.studentRepository.updateStudent(id, studentDto);
  }

  removeStudent(id: string): Promise<void> {
    return this.studentRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error('No student found with the given id.');
      }
    });
  }

  async importStudentsFromExcel(data: any): Promise<MessageResponse> {
    let errorStudents = [];
    let hashStudents = [];
    let contract;

    await getManager().transaction(async (transaction) => {
      try {
        ({ errorStudents, hashStudents } =
          await this.studentRepository.importStudentsFromExcel(
            transaction,
            data,
          ));

        if (hashStudents.length > 0) {
          contract = await this.contractService.addStudents(hashStudents);
          await this.dataHashService.createDataHash(transaction, contract);
        }
      } catch (error) {
        throw new Error('Transaction failed: ' + error.message);
      }
    });

    if (errorStudents.length > 0) {
      return new MessageResponse(
        HttpStatus.PARTIAL_CONTENT,
        MessageEnum.ENTITY_ERROR_CREATE,
        errorStudents,
      );
    }

    return new MessageResponse(
      HttpStatus.OK,
      MessageEnum.STUDENT_CREATED,
      null,
    );
  }
}
