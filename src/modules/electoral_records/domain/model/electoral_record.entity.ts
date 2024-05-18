import { ElectoralRecordSignatureEntity } from 'src/modules/electoral_records_signature/domain/model/electoral_record_signature.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('electoral_record', { schema: 'voting' })
export class ElectoralRecordEntity extends BaseTableEntity {
  @Column({ type: 'timestamp', nullable: true, name: 'open_date' })
  openDate!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'close_date' })
  closeDate!: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observation!: string;

  @Column({ default: 0, name: 'votes_null' })
  votesNull!: number;

  @OneToMany(
    () => ElectoralRecordSignatureEntity,
    (signature) => signature.electoralRecord,
  )
  signatures!: ElectoralRecordSignatureEntity[];
}
