import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { ElectoralRecordService } from './electoral_record.service';
import { ElectoralRecordCreateDto } from '../domain/dto/electoral_record_create.dto';
import { ElectoralRecordUpdateDto } from '../domain/dto/electoral_record_update.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';

@Controller('/electoral-records')
export class ElectoralRecordController {
  constructor(private readonly service: ElectoralRecordService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  create(@Body() dto: ElectoralRecordCreateDto) {
    return this.service.create(dto);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/open-election')
  openElection(@Req() req) {
    const auth = req.headers.authorization;
    return this.service.openElection(auth);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/close-election')
  closeElection(@Req() req, @Body() body: {signature: string}){
    const { signature } = body;
    if(!signature) throw new HttpException('Signature is required', 400);
    const auth = req.headers.authorization;
    return this.service.closeElection(auth, signature);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/get-all')
  findAll() {
    return this.service.findAll();
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.DELEGATE)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
