import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VotesService } from './vote.service';
import { VoteCreateDto } from '../domain/dto/vote_create.dto';
import { VoteUpdateDto } from '../domain/dto/vote_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Req() req, @Body() createDto: VoteCreateDto) {
    const auth = req.headers.authorization;
    return this.votesService.createVote(createDto, auth);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/all')
  findAll() {
    return this.votesService.findAllVotes();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.votesService.findVoteById(id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.votesService.deleteVote(id);
  }
}
