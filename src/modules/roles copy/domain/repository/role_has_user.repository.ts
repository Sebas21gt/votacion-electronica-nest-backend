// import { Injectable, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RoleEntity } from '../model/role_has_user.entity';
// import { RoleCreateDto } from '../dto/role_create.dto';
// import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
// import { MessageEnum } from 'src/modules/shared/enums/message.enum';

// @Injectable()
// export class RoleRepository {
//   constructor(
//     @InjectRepository(RoleEntity)
//     private readonly repository: Repository<RoleEntity>,
//   ) {}

//   async createRole(
//     roleDto: RoleCreateDto,
//     creator: string,
//   ): Promise<MessageResponse | RoleEntity> {
//     const role = this.repository.create(roleDto);
//     role.creationUser = creator;
//     // role.updateUser = creator;

//     try {
//       await this.repository.save(role);
//       // return new MessageResponse(HttpStatus.CREATED, MessageEnum.ROLE_CREATED);
//     } catch (e) {
//       console.error(e);
//       return new MessageResponse(
//         HttpStatus.BAD_REQUEST,
//         MessageEnum.ENTITY_ERROR_CREATE,
//         null,
//       );
//     }
//     return role;
//   }

//   async updateRole(
//     id: string,
//     roleDto: RoleCreateDto,
//   ): Promise<MessageResponse | RoleEntity> {
//     const role = await this.repository.findOne({ where: { id } });
//     if (!role) {
//       return new MessageResponse(
//         HttpStatus.NOT_FOUND,
//         MessageEnum.NOT_FOUND,
//         null,
//       );
//     }
//     this.repository.merge(role, roleDto);
//     try {
//       await this.repository.save(role);
//     } catch (e) {
//       console.error(e);
//       return new MessageResponse(
//         HttpStatus.BAD_REQUEST,
//         MessageEnum.ENTITY_ERROR_UPDATE,
//         null,
//       );
//     }
//     return role;
//   }

//   async deleteRole(id: string): Promise<MessageResponse> {
//     try {
//       const deleteResult = await this.repository.delete(id);
//       if (!deleteResult.affected) {
//         return new MessageResponse(
//           HttpStatus.NOT_FOUND,
//           MessageEnum.NOT_FOUND,
//           null,
//         );
//       }
//     } catch (e) {
//       console.error(e);
//       return new MessageResponse(
//         HttpStatus.BAD_REQUEST,
//         MessageEnum.ENTITY_ERROR_DELETE,
//         null,
//       );
//     }
//     return new MessageResponse(
//       HttpStatus.OK,
//       MessageEnum.ROLE_DELETE,
//       'Role deleted successfully',
//     );
//   }
// }
