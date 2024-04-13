import { EntityRepository, Repository } from "typeorm";
import { UserCreateDto } from "../dto/user-create.dto";
import { UserEntity } from "../model/user.entity";
import { HttpStatus } from "@nestjs/common";
import { StatusEnum } from "src/modules/shared/enums/status.enum";
import { MessageResponse } from "src/modules/shared/domain/model/message.response";
import { MessageEnum } from "src/modules/shared/enums/message.enum";

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

  // async updateUser(
  //   id: string,
  //   userDto: UserCreateDto,
  //   updater: string,
  // ): Promise<UserEntity> {
  //   const user = await this.repository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   this.repository.merge(user, userDto, { updateUser: updater });
  //   try {
  //     return await this.repository.save(user);
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(
  //       'Failed to update user due to an error.',
  //     );
  //   }
  // }

  // async findOne(id: string): Promise<UserEntity> {
  //   const user = await this.repository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   return user;
  // }

  // async findAll(): Promise<UserEntity[]> {
  //   try {
  //     return await this.repository.find();
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(
  //       'Failed to retrieve users due to an error.',
  //     );
  //   }
  // }
}
