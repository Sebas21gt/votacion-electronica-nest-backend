import { PollingTableEntity } from 'src/modules/polling_tables/domain/model/polling_table.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('votes', { schema: 'voting' })
export class VotesEntity extends BaseTableEntity {
  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity;

  @ManyToOne(() => PollingTableEntity)
  @JoinColumn({ name: 'polling_table_id' })
  pollingTable!: PollingTableEntity;
}
