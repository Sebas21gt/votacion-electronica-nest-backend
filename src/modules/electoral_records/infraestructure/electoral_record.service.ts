// src/electoral-record/electoral-record.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElectoralRecordRepository } from '../domain/repository/electoral_record.repository';
import { ElectoralRecordCreateDto } from '../domain/dto/electoral_record_create.dto';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';
import { UserRepository } from 'src/modules/users/domain/repository/user.repository';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { ElectoralRecordSignatureRepository } from 'src/modules/electoral_records_signature/domain/repository/electoral_record_signature.repository';
import { PollingTablesRepository } from 'src/modules/polling_tables/domain/repository/polling_table.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractService } from 'src/modules/eth_contracts/eth_contract.service';
import { DataHashService } from 'src/modules/hashes/infraestructure/hash.service';
import { StudentsFrontRepository } from 'src/modules/students_fronts/domain/repository/student_front.repository';
import { In, Not, getManager } from 'typeorm';
import { keccak256, toUtf8Bytes } from 'ethers';
import { ResultsRepository } from 'src/modules/results/domain/repository/result.repository';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
const moment = require('moment');
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

Handlebars.registerHelper('formatDate', function (dateString) {
  return moment(dateString).format('DD/MM/YYYY HH:mm');
});

@Injectable()
export class ElectoralRecordService {
  constructor(
    @InjectRepository(ElectoralRecordRepository)
    private readonly electoralRecordRepo: ElectoralRecordRepository,
    private readonly userRepository: UserRepository,
    private readonly electoralRecordSignatureRepository: ElectoralRecordSignatureRepository,
    private readonly resultsRepository: ResultsRepository,
    private readonly pollingTablesRepository: PollingTablesRepository,
    private readonly studentFrontRepository: StudentsFrontRepository,
    private readonly contractService: ContractService,
    private readonly dataHashService: DataHashService,
  ) {}

  create(dto: ElectoralRecordCreateDto) {
    return this.electoralRecordRepo.createElectoralRecord(dto);
  }

  async openElection(auth: string) {
    const userId = await JwtHelper.getUserIdJWT(auth);
    const user = await this.userRepository.findOne(userId, {
      where: { status: StatusEnum.Active },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const committee = await this.electoralRecordSignatureRepository.findOne({
      where: { userId: user.id, status: StatusEnum.Active },
    });
    if (!committee) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const electoralRecord = await this.electoralRecordRepo.findOneElectoral();
    if (!electoralRecord) {
      throw new HttpException(
        'Electoral record not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    electoralRecord.totalAuthOpen += 1;

    if (electoralRecord.totalAuthOpen === 4) {
      await getManager().transaction(async (transaction) => {
        const pollingTables = await this.pollingTablesRepository.find({
          where: { status: StatusEnum.Active },
        });
        const studentFronts = await this.studentFrontRepository.find({
          where: {
            status: StatusEnum.Active,
            name: Not(In(['Nulo', 'Blanco'])),
          },
        });

        const numberTables = pollingTables.map((table, index) => index + 1);
        const isOpens = new Array(pollingTables.length).fill(true);
        const totalDelegates = new Array(pollingTables.length).fill(
          studentFronts.length,
        );

        await this.pollingTablesRepository.update(
          { status: StatusEnum.Active },
          { isOpen: true, dateOpen: new Date() },
        );
        console.log(numberTables, isOpens, totalDelegates);
        // await this.contractService.openVoting();
        const contract = await this.contractService.addPollingTables(
          numberTables,
          isOpens,
          totalDelegates,
        );
        await this.dataHashService.createDataHash(transaction, contract);
      });
    }

    await this.electoralRecordRepo.update(electoralRecord.id, electoralRecord);
  }

  async closeElection(auth: string, signature: string) {
    const userId = await JwtHelper.getUserIdJWT(auth);
    console.log(userId);
    const user = await this.userRepository.findOne(userId, {
      where: { status: StatusEnum.Active },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const committee = await this.electoralRecordSignatureRepository.findOne({
      where: { userId: user.id, status: StatusEnum.Active },
    });
    if (!committee) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const electoralRecord = await this.electoralRecordRepo.findOne();
    if (!electoralRecord) {
      throw new HttpException(
        'Electoral record not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    electoralRecord.totalAuthClose += 1;

    if (electoralRecord.totalAuthClose === 4) {
      await this.pollingTablesRepository.update(
        { status: StatusEnum.Active },
        { isOpen: false, dateClosed: new Date() },
      );

      await this.electoralRecordRepo.update({
        status: StatusEnum.Active,
      }, 
      { closeDate: new Date() });
    }

    committee.signature = signature;

    await this.electoralRecordSignatureRepository.update(
      committee.id,
      committee,
    );
    console.log('close election');

    await getManager().transaction(async (transaction) => {
      const hash = keccak256(toUtf8Bytes(committee.id));
      const electoralRecordHash = keccak256(toUtf8Bytes(electoralRecord.id));
      const signatureHash = keccak256(toUtf8Bytes(committee.signature));

      const contract = await this.contractService.closeElectoralRecord(
        hash,
        electoralRecordHash,
        signatureHash,
      );

      await this.dataHashService.createDataHash(transaction, contract);
    });
    await this.electoralRecordRepo.updateElectoralRecord(
      electoralRecord.id,
      electoralRecord,
    );
  }

  delete(id: string) {
    return this.electoralRecordRepo.deleteElectoralRecord(id);
  }

  findAll() {
    return this.electoralRecordRepo.findAllElectoralRecords();
  }

  findById(id: string) {
    return this.electoralRecordRepo.findElectoralRecordById(id);
  }

  async getCompleteElectoralDetails(): Promise<any> {
    const electoralRecord = await this.electoralRecordRepo.findOneElectoral();
    const results = await this.resultsRepository.findAllResults();
    const signatures =
      await this.electoralRecordSignatureRepository.findAllSignatures();

    results.sort((a, b) => {
      const special = ['Blanco', 'Nulo'];
      const aIsSpecial = special.includes(a.studentFrontName);
      const bIsSpecial = special.includes(b.studentFrontName);

      if (aIsSpecial && !bIsSpecial) return 1;
      if (!aIsSpecial && bIsSpecial) return -1;

      return b.votes - a.votes;
    });

    const totalVotes = results.reduce((total, current) => total + current.votes, 0);

    return {
      electoralRecord: {
        id: electoralRecord.id,
        openDate: electoralRecord.openDate,
        closeDate: electoralRecord.closeDate,
      },
      totalVotes: totalVotes,
      results: results.map((result) => ({
        id: result.id,
        votes: result.votes,
        studentFrontName: result.studentFront.name,
      })),
      signatures: signatures.map((signature) => ({
        id: signature.id,
        electoralRecordId: signature.electoralRecordId,
        userId: signature.userId,
        signature: signature.signature,
        fullname: signature.fullname,
        position: signature.position,
      })),
    };
  }

  async generateElectoralPdf(res: Response): Promise<void> {
    const details = await this.getCompleteElectoralDetails();

    // Cargar el archivo HTML como plantilla
    const htmlContent = fs.readFileSync(
      'src/modules/electoral_records/infraestructure/pdf_template.html',
      'utf8',
    );
    const template = Handlebars.compile(htmlContent);
    const html = template(details);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=electoral-report.pdf',
    );
    res.send(pdf);

    await browser.close();
  }
}
