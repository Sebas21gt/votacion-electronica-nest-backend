import { ElectoralRecordEntity } from 'src/modules/electoral_records/domain/model/electoral_record.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('results', { schema: 'voting' })
export class ResultsEntity extends BaseTableEntity {
  @Column()
  votes!: number;

  @ManyToOne(() => ElectoralRecordEntity)
  @JoinColumn({ name: 'electoral_record_id' })
  electoralRecord!: ElectoralRecordEntity;

  @ManyToOne(() => StudentsFrontEntity)
  @JoinColumn({ name: 'student_front_id' })
  studentFront!: StudentsFrontEntity;
}
