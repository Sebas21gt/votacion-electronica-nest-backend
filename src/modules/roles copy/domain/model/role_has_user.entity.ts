// import { UUID } from 'crypto';
// import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
// import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
// import { UserEntity } from 'src/modules/users/domain/model/user.entity';
// import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';

// @Entity('roles_has_user', { schema: 'voting' })
// export class RolesHasUserEntity extends BaseTableEntity {
//   @Column({ name: 'rol_id', type: 'uuid', nullable: false})
//   rolid!: string;

//   @Column({ name: 'user_id', type: 'uuid', nullable: false})
//   userid!: string;

  // @OneToMany(() => RoleEntity, (role) => role.rolesHasUser)
  // role!: RoleEntity[];

  // @OneToMany(() => UserEntity, (user) => user.rolesHasUser)
  // user!: UserEntity;

  // @ManyToMany(() => RolEntity, (user) => user.roles)
  // users!: RolEntity[];
// }
