import { Entity, Column, ManyToMany, BeforeInsert } from 'typeorm';
import { hash } from 'bcrypt';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';

@Entity('users', { schema: 'voting' })
export class UserEntity extends BaseTableEntity {
  @Column({ length: 60 })
  username!: string;

  @Column()
  password!: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  roles!: RoleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10); // Simplificar usando un valor fijo para el ejemplo
  }
}
