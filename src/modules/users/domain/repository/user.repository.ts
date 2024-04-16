import { EntityRepository, Repository } from 'typeorm';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserEntity } from '../model/user.entity';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { hash, compare } from 'bcryptjs';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(userDto: UserCreateDto, username: string): Promise<any> {
    const user = new UserEntity();
    Object.assign(user, userDto);

    try {
      user.username = user.username.toLowerCase();
      user.status = StatusEnum.Active;
      user.creationUser = username;
      await user.save();
    } catch (e) {
      console.log(e);
      return new MessageResponse(
        HttpStatus.NOT_FOUND,
        MessageEnum.ENTITY_ERROR_CREATE,
        null,
      );
    }

    delete user.password;
    return user;
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
