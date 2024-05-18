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
import { ProposalsService } from './proposal.service';
import { ProposalCreateDto } from '../domain/dto/proposal_create.dto';
import { ProposalUpdateDto } from '../domain/dto/proposal_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Roles(
    RolesEnum.ADMIN,
    RolesEnum.COMMITTEE,
    RolesEnum.DELEGATE,
    RolesEnum.STUDENT,
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  findAll() {
    return this.proposalsService.findAll();
  }

  @Roles(
    RolesEnum.ADMIN,
    RolesEnum.COMMITTEE,
    RolesEnum.DELEGATE,
    RolesEnum.STUDENT,
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-proposal-by-student-front/:id')
  getProposalByStudentFront(@Param('id') id: string) {
    return this.proposalsService.findAllByStudentFront(id);
  }

  @Roles(
    RolesEnum.ADMIN,
    RolesEnum.COMMITTEE,
    RolesEnum.DELEGATE,
    RolesEnum.STUDENT,
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-proposal/:id')
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create-proposal')
  create(@Body() proposalCreateDto: ProposalCreateDto) {
    return this.proposalsService.create(proposalCreateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() proposalUpdateDto: ProposalUpdateDto,
  ) {
    return this.proposalsService.update(id, proposalUpdateDto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.proposalsService.remove(id);
  }
}
