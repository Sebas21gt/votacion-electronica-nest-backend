import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity('roles', { schema: 'voting' })
export class RoleEntity extends BaseTableEntity {
  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description!: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users!: UserEntity[];
}
