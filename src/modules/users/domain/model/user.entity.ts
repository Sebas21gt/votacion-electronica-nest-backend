import { Entity, Column, ManyToMany, BeforeInsert, JoinTable, ManyToOne, Unique } from 'typeorm';
import { hash } from 'bcrypt';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
// import { RolesHasUserEntity } from 'src/modules/roles copy/domain/model/role_has_user.entity';

@Entity('users', { schema: 'voting' })
@Unique(['username'])
export class UserEntity extends BaseTableEntity {
  @Column({ length: 60 })
  username!: string;

  @Column()
  password!: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'roles_has_users',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' },
  })
  roles!: RoleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
