import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { VotesService } from './vote.service';
import { VoteCreateDto } from '../domain/dto/vote_create.dto';
import { VoteUpdateDto } from '../domain/dto/vote_update.dto';

@Controller('/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('/create')
  create(@Body() createDto: VoteCreateDto) {
    return this.votesService.createVote(createDto);
  }

  @Get('/all')
  findAll() {
    return this.votesService.findAllVotes();
  }

  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.votesService.findVoteById(id);
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateDto: VoteUpdateDto) {
    return this.votesService.updateVote(id, updateDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.votesService.deleteVote(id);
  }
}
