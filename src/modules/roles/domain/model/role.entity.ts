// import { RolesHasUserEntity } from 'src/modules/roles copy/domain/model/role_has_user.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity('roles', { schema: 'voting' })
export class RoleEntity extends BaseTableEntity {
  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description!: string;

  // @ManyToOne(() => RolesHasUserEntity, (rolesHasUser) => rolesHasUser.role)
  // rolesHasUser!: RolesHasUserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinTable({
    name: 'roles_has_users',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users!: UserEntity[];
}
