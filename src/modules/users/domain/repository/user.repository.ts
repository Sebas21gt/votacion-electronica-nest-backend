import { EntityRepository, Repository, getManager } from 'typeorm';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserEntity } from '../model/user.entity';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { hash, compare } from 'bcryptjs';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(
    userDto: UserCreateDto,
  ): Promise<UserEntity | MessageResponse> {
    const user = this.create(userDto);
    user.username = user.username.toLowerCase();
    user.status = StatusEnum.Active;
    user.password = user.password;

    const role = await getManager().findOne(RoleEntity, {
      where: { id: RolesEnum.STUDENT },
    });

    if (!role) {
      throw new Error('Role not found for students.');
    }

    user.roles = [role];

    try {
      await this.save(user);
      delete user.password;
      return user;
    } catch (e) {
      console.error('Failed to create user: ' + e.message);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create user.',
      );
    }
  }

  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<MessageResponse> {
    const user = await this.findOne(userId);
    if (!user) {
      return new MessageResponse(
        HttpStatus.NOT_FOUND,
        MessageEnum.USER_NOT_EXIST,
        'User not found.',
      );
    }

    const passwordMatches = await compare(oldPassword, user.password);
    if (!passwordMatches) {
      return new MessageResponse(
        HttpStatus.BAD_REQUEST,
        MessageEnum.INVALID_OLD_PASSWORD,
        'Old password does not match.',
      );
    }

    try {
      user.password = await hash(newPassword, 10);
      await this.save(user);
      return new MessageResponse(
        HttpStatus.OK,
        MessageEnum.PASSWORD_RESET,
        'Password reset successfully.',
      );
    } catch (e) {
      console.error(e);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to reset password.',
      );
    }
  }

  async findOneById(userId: string): Promise<UserEntity | undefined> {
    try {
      const user = await this.findOne(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to retrieve user.');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.find();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to retrieve users.');
    }
  }
}
