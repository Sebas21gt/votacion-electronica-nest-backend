import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { UserEntity } from '../domain/model/user.entity';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/shared/decorators/roles.decorator';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RolesEnum.ADMIN, RolesEnum.STUDENT)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create-user')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() userDto: UserCreateDto,
  ): Promise<UserEntity | object> {
    return await this.userService.userCreate(userDto);
  }

  @Put('/reset-password/:userId')
  async resetPassword(
    @Param('userId') userId: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return await this.userService.resetPassword(
      userId,
      oldPassword,
      newPassword,
    );
  }

  @Get('/get-user/:id')
  async getUserById(@Param('id') userId: string): Promise<UserEntity> {
    return this.userService.findUserById(userId);
  }

  @Get('/get-users')
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.findAllUsers();
  }
}
