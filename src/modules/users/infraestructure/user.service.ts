import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repository/user.repository';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { UserEntity } from '../domain/model/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async userCreate(
    userCreateDto: UserCreateDto,
    username: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username: userCreateDto.username, status: StatusEnum.Active },
    });

    if (user) {
      return new MessageResponse(HttpStatus.OK, MessageEnum.USER_EXIST, null);
    }

    return this.userRepository.createUser(userCreateDto, username);
  }

  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<MessageResponse> {
    return await this.userRepository.resetPassword(
      userId,
      oldPassword,
      newPassword,
    );
  }

  async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return user;
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
