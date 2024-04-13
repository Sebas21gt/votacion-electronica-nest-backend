import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repository/user.repository';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository,	
  ) { }

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

  //   async getUserById(id: string): Promise<UserEntity> {
  //       return this.userRepository.findOne(id);
  //   }

  //   async getAllUsers(): Promise<UserEntity[]> {
  //     return this.userRepository.findAll();
  // }

  //   async updateUser(id: string, userDto: UserCreateDto, updater: string): Promise<UserEntity> {
  //       return this.userRepository.updateUser(id, userDto, updater);
  //   }
}
