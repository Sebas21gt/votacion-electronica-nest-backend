import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProposalsService } from './proposal.service';
import { ProposalCreateDto } from '../domain/dto/proposal_create.dto';
import { ProposalUpdateDto } from '../domain/dto/proposal_update.dto';

@Controller('/proposals')
export class ProposalsController {
    constructor(private readonly proposalsService: ProposalsService) {}

    @Get('/get-proposals')
    findAll() {
        return this.proposalsService.findAll();
    }

    @Get('/get-proposal/:id')
    findOne(@Param('id') id: string) {
        return this.proposalsService.findOne(id);
    }

    @Post('/create-proposal')
    create(@Body() proposalCreateDto: ProposalCreateDto) {
        return this.proposalsService.create(proposalCreateDto);
    }

    @Put('/update-proposal/:id')
    update(@Param('id') id: string, @Body() proposalUpdateDto: ProposalUpdateDto) {
        return this.proposalsService.update(id, proposalUpdateDto);
    }

    @Delete('/delete-proposal/:id')
    remove(@Param('id') id: string) {
        return this.proposalsService.remove(id);
    }
}
