import { PollingTableEntity } from 'src/modules/polling_tables/domain/model/polling_table.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('delegates', { schema: 'voting' })
export class DelegatesEntity extends BaseTableEntity {
  @ManyToOne(() => PollingTableEntity)
  @JoinColumn({ name: 'polling_table_id' })
  pollingTable!: PollingTableEntity;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity;

  @ManyToOne(() => StudentsFrontEntity)
  @JoinColumn({ name: 'student_front_id' })
  studentFront!: StudentsFrontEntity;
}
