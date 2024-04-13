import { FacultyEntity } from 'src/modules/faculties/domain/model/faculty.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { Entity, JoinColumn, Column, ManyToMany, ManyToOne } from 'typeorm';

@Entity('careers', { schema: 'voting' })
export class CareerEntity extends BaseTableEntity {
  @Column({ length: 120 })
  name!: string;

  @ManyToMany(() => StudentEntity, (student) => student.careers)
  students!: StudentEntity[];

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.careers)
  @JoinColumn({ name: 'faculty_id' })
  faculty!: FacultyEntity;
}
