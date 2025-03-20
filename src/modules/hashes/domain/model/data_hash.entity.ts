import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, Timestamp } from 'typeorm';

@Entity('data_hash', { schema: 'voting' })
export class DataHashEntity extends BaseTableEntity {
  @Column()
  nonce!: number;

  @Column({ name: 'chain_id'})
  chainId!: number;

  @Column()
  signature!: string;

  @Column({ name: 'block_hash'})
  blockHash!: string;

  @Column({ type: 'timestamp', name: 'date_transaction'})
  dateTransaction!: Date;

  @Column({ name: 'block_number' })
  blockNumber!: number;

  @Column({ length: 300, name: 'result_event'})
  resultEvent!: string;
}
