// src/polling_tables/polling_tables.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollingTableEntity } from '../domain/model/polling_table.entity';
import { PollingTableCreateDto } from '../domain/dto/polling_table_create.dto';
import { PollingTablesRepository } from '../domain/repository/polling_table.repository';
import { PollingTableUpdateDto } from '../domain/dto/polling_table_update.dto';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { StudentRepository } from 'src/modules/students/domain/repository/student.repository';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { DelegatesRepository } from 'src/modules/delegates/domain/repository/delegate.repository';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { keccak256, toUtf8Bytes } from 'ethers';
import { In, Not, getManager } from 'typeorm';

@Injectable()
export class PollingTablesService {
  constructor(
    @InjectRepository(PollingTablesRepository)
    private readonly pollingTablesRepository: PollingTablesRepository,
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly delegateRepository: DelegatesRepository,
    private readonly contractService: ContractService,
    private readonly dataHashService: DataHashService,
  ) {}

  async create(createDto: PollingTableCreateDto): Promise<PollingTableEntity> {
    const pollingTable = this.pollingTablesRepository.create(createDto);
    return await this.pollingTablesRepository.createPollingTable(pollingTable);
  }

  async findAll(): Promise<PollingTableEntity[]> {
    return await this.pollingTablesRepository.find();
  }

  async findPollingTableById(id: string): Promise<any> {
    return await this.pollingTablesRepository.findPollingTableById(id);
  }

  async closeTable(
    auth: string,
    signature: string,
  ): Promise<PollingTableEntity> {
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

    delegate.signature = signature as string;

    const pollingTable = await this.pollingTablesRepository.findOne(
      delegate.pollingTableId,
    );
    const countDelegatesPollingTable = await this.delegateRepository.count({
      where: { pollingTableId: pollingTable.id, status: StatusEnum.Active },
    });

    const threshold = Math.floor(countDelegatesPollingTable / 2) + 1;

    await getManager().transaction(async (transaction) => {
      const hash = keccak256(toUtf8Bytes(pollingTable.id));
      const numberTable = pollingTable.numberTable;
      const delegateHash = keccak256(toUtf8Bytes(delegate.id));
      const signatureHash = keccak256(toUtf8Bytes(delegate.signature));
      const totalSignatures = countDelegatesPollingTable;

      const contract = await this.contractService.closePollingTable(
        hash,
        numberTable,
        delegateHash,
        signatureHash,
        totalSignatures,
      );

      await this.dataHashService.createDataHash(transaction, contract);
    });
    return this.pollingTablesRepository.closeTable(
      delegate,
      pollingTable,
      threshold,
    );
  }

  async update(
    id: string,
    updateDto: PollingTableUpdateDto,
  ): Promise<PollingTableEntity> {
    const pollingTable = await this.pollingTablesRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!pollingTable) {
      throw new Error('Polling table not found');
    }
    return this.pollingTablesRepository.save(pollingTable);
  }

  async deletePollingTable(id: string): Promise<void> {
    await this.pollingTablesRepository.deletePollingTable(id);
  }
}
