import { DelegatesEntity } from 'src/modules/delegates/domain/model/delegate.entity';
import { ElectoralRecordEntity } from 'src/modules/electoral_records/domain/model/electoral_record.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('electoral_record_signature', { schema: 'voting' })
export class ElectoralRecordSignatureEntity extends BaseTableEntity {
  @Column()
  signature: string;

  @Column({ type: 'uuid', name: 'electoral_record_id' })
  electoralRecordId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ length: 120 })
  fullname!: string;

  @Column({ length: 120 })
  position!: string;

  @Column({ length: 500 })
  observation!: string;

  @ManyToOne(() => ElectoralRecordEntity)
  @JoinColumn({ name: 'electoral_record_id' })
  electoralRecord!: ElectoralRecordEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
