// src/electoral_record_signature/electoral_record_signature.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ElectoralRecordSignatureService } from './electoral_record_signature.service';
import { ElectoralRecordSignatureCreateDto } from '../domain/dto/electoral_record_signature_create.dto';
import { ElectoralRecordSignatureUpdateDto } from '../domain/dto/electoral_record_signature_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/electoral-record-signatures')
export class ElectoralRecordSignatureController {
  constructor(
    private readonly signatureService: ElectoralRecordSignatureService,
  ) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Body() createDto: ElectoralRecordSignatureCreateDto) {
    return this.signatureService.createSignature(createDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  findAll() {
    return this.signatureService.findAllSignatures();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.signatureService.findSignatureById(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDto: ElectoralRecordSignatureUpdateDto,
  ) {
    return this.signatureService.updateSignature(id, updateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.signatureService.deleteSignature(id);
  }
}
