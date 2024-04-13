import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { PollingTableEntity } from 'src/modules/polling_tables/domain/model/polling_table.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity('electoral_configuration', { schema: 'voting' })
export class ElectoralConfigurationEntity extends BaseTableEntity {
  @Column({ type: 'timestamp' })
  electionDateStart!: Date;

  @Column({ type: 'timestamp' })
  electionDateFinish!: Date;

  @Column({ type: 'time' })
  timeElection!: string;

  @Column()
  numberTableElections!: number;

  @OneToMany(
    () => PollingTableEntity,
    (pollingTable) => pollingTable.electoralConfiguration,
  )
  pollingTables!: PollingTableEntity[];

  @ManyToOne(() => CareerEntity, (career) => career.id)
  @Column('uuid')
  careerId!: string;
}
