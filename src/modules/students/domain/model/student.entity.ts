import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('students', { schema: 'voting' })
export class StudentEntity extends BaseTableEntity {
  @Column({ length: 80 })
  name!: string;

  @Column({ length: 200 })
  lastName!: string;

  @Column({ length: 60 })
  collegeNumber!: string;

  @Column()
  isHabilitated!: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToMany(() => CareerEntity)
  @JoinTable({
    name: 'students_careers',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'career_id', referencedColumnName: 'id' },
  })
  careers!: CareerEntity[];
}
