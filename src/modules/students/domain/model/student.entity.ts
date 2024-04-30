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
  Unique,
} from 'typeorm';

@Entity('students', { schema: 'voting' })
@Unique(['ciNumber' ,'collegeNumber'])
export class StudentEntity extends BaseTableEntity {
  @Column({ name: 'full_name', length: 400 })
  fullname!: string;

  @Column({ name: 'college_number', length: 60 })
  collegeNumber!: string;

  @Column({ name: 'ci_number', length: 20 })
  ciNumber!: string;

  @Column({ name: 'is_habilitated'})
  isHabilitated!: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  userId!: UserEntity;

  @ManyToMany(() => CareerEntity)
  @JoinTable({
    name: 'students_careers',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'career_id', referencedColumnName: 'id' },
  })
  careers!: CareerEntity[];
}
