// src/electoral_record_signature/electoral_record_signature.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ElectoralRecordSignatureService } from './electoral_record_signature.service';
import { ElectoralRecordSignatureCreateDto } from '../domain/dto/electoral_record_signature_create.dto';
import { ElectoralRecordSignatureUpdateDto } from '../domain/dto/electoral_record_signature_update.dto';

@Controller('/electoral-record-signatures')
export class ElectoralRecordSignatureController {
    constructor(private readonly signatureService: ElectoralRecordSignatureService) {}

    @Post('/create')
    create(@Body() createDto: ElectoralRecordSignatureCreateDto) {
        return this.signatureService.createSignature(createDto);
    }

    @Get('/all')
    findAll() {
        return this.signatureService.findAllSignatures();
    }

    @Get('/get/:id')
    findOne(@Param('id') id: string) {
        return this.signatureService.findSignatureById(id);
    }

    @Put('/update/:id')
    update(@Param('id') id: string, @Body() updateDto: ElectoralRecordSignatureUpdateDto) {
        return this.signatureService.updateSignature(id, updateDto);
    }

    @Delete('/delete/:id')
    remove(@Param('id') id: string) {
        return this.signatureService.deleteSignature(id);
    }
}
