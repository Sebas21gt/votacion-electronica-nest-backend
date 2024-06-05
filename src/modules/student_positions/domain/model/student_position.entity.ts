import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('student_positions', { schema: 'voting' })
export class StudentPositionEntity extends BaseTableEntity {
  @Column({ name: 'position_name' ,length: 120 })
  positionName!: string;

  @Column({ name: 'position_description',type: 'text' })
  positionDescription!: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity;

  @ManyToOne(() => StudentsFrontEntity)
  @JoinColumn({ name: 'front_id' })
  front!: StudentsFrontEntity;
}
