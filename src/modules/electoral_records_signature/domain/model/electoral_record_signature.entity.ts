import { ElectoralRecordEntity } from 'src/modules/electoral_records/domain/model/electoral_record.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('electoral_record_signature', { schema: 'voting' })
export class ElectoralRecordSignatureEntity extends BaseTableEntity {
  @Column({ type: 'bytea' })
  signature!: Buffer;

  @ManyToOne(
    () => ElectoralRecordEntity,
    (electoralRecord) => electoralRecord.signatures,
  )
  @JoinColumn({ name: 'electoral_record_id' })
  electoralRecord!: ElectoralRecordEntity;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'delegate_id' })
  delegate!: StudentEntity;
}
