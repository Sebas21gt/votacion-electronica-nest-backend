import { BeforeInsert, Column, Entity } from 'typeorm';
import { hash } from 'bcrypt';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';

@Entity('users', { schema: 'canchitas' })
export class UserEntity extends BaseTableEntity {
  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(
      this.password,
      parseInt(process.env.ROUNDS_SECURITY),
    );
  }
}
