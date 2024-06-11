import { ElectoralRecordSignatureEntity } from 'src/modules/electoral_records_signature/domain/model/electoral_record_signature.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('electoral_record', { schema: 'voting' })
export class ElectoralRecordEntity extends BaseTableEntity {
  @Column({ type: 'timestamp', nullable: true, name: 'open_date' })
  openDate!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'close_date' })
  closeDate!: Date;

  @Column({ name: 'total_authorizations_open'})
  totalAuthOpen!: number;

  @Column({ name: 'total_authorizations_close'})
  totalAuthClose!: number;
}
