import { EntityRepository, Repository } from 'typeorm';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserEntity } from '../model/user.entity';
import { HttpStatus } from '@nestjs/common';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(userDto: UserCreateDto, username: string): Promise<any> {
    const user = new UserEntity();
    Object.assign(user, userDto);

    try {
      user.email = user.email.trim();
      user.status = StatusEnum.Active;
      user.userCreation = username;
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

  async registerUser(userDto: UserCreateDto): Promise<any> {
    const user = new UserEntity();
    Object.assign(user, userDto);

    try {
      user.email = user.email.trim();
      user.status = StatusEnum.Active;
      user.userCreation = 'System';
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
}
