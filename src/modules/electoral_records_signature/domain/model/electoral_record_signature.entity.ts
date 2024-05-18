import { DelegatesEntity } from 'src/modules/delegates/domain/model/delegate.entity';
import { ElectoralRecordEntity } from 'src/modules/electoral_records/domain/model/electoral_record.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('electoral_record_signature', { schema: 'voting' })
export class ElectoralRecordSignatureEntity extends BaseTableEntity {
  @Column({ type: 'bytea' })
  signature!: Buffer;

  @Column({ type: 'uuid', name: 'electoral_record_id' })
  electoralRecordId!: string;

  @Column({ type: 'uuid', name: 'delegate_id' })
  delegateId!: string;

  @ManyToOne(
    () => ElectoralRecordEntity,
    (electoralRecord) => electoralRecord.signatures,
  )
  @JoinColumn({ name: 'electoral_record_id' })
  electoralRecord!: ElectoralRecordEntity;

  @ManyToOne(() => DelegatesEntity)
  @JoinColumn({ name: 'delegate_id' })
  delegate!: DelegatesEntity;
}
