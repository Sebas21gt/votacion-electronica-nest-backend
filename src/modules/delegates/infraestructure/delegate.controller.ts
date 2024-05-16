import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { DelegatesService } from './delegate.service';
import { DelegatesEntity } from '../domain/model/delegate.entity';
import { DelegateCreateDto } from '../domain/dto/delegate_create.dto';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { GlobalService } from 'src/modules/shared/global.service';

@Controller('/delegates')
export class DelegatesController {
    constructor(private delegatesService: DelegatesService) {}

    @Roles(RolesEnum.ADMIN, RolesEnum.COMMITTEE, RolesEnum.STUDENT)
    @UseGuards(AuthGuard, RoleGuard)
    @Post('/create')
    create(@Body() delegate: DelegateCreateDto) {
        console.log(GlobalService);
        return this.delegatesService.createDelegate(delegate);
    }

    @Get('/all')
    findAll() {
        return this.delegatesService.findAll();
    }

    @Get('/get/:id')
    findOne(@Param('id') id: string) {
        return this.delegatesService.findOne(id);
    }

    @Put('/update/:id')
    update(@Param('id') id: string, @Body() delegate: Partial<DelegatesEntity>) {
        return this.delegatesService.update(id, delegate);
    }

    @Delete('/delete/:id')
    remove(@Param('id') id: string) {
        return this.delegatesService.remove(id);
    }
}
