import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { PollingTableEntity } from 'src/modules/polling_tables/domain/model/polling_table.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';

@Entity('delegates', { schema: 'voting' })
export class DelegatesEntity extends BaseTableEntity {
  @Column({ type: 'uuid', name: 'polling_table_id' })
  pollingTableId: string;

  @ManyToOne(() => PollingTableEntity)
  @JoinColumn({ name: 'polling_table_id' })
  pollingTable?: PollingTableEntity;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student?: StudentEntity;

  @Column()
  signature!: string;

  @Column({ type: 'uuid', name: 'student_front_id' })
  studentFrontId: string;

  @ManyToOne(() => StudentsFrontEntity)
  @JoinColumn({ name: 'student_front_id' })
  studentFront?: StudentsFrontEntity;
}
