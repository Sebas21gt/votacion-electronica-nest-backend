import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('hashes', { schema: 'voting' })
export class HashesEntity extends BaseTableEntity {
  @Column({ type: 'bytea' })
  transactionId!: Buffer;

  @Column({ type: 'timestamp' })
  dateTransaction!: Date;

  @Column()
  numBlock!: number;

  @Column({ length: 300 })
  event!: string;
}
