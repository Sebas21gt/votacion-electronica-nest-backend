import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { PollingTableEntity } from 'src/modules/polling_tables/domain/model/polling_table.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';

@Entity('electoral_configuration', { schema: 'voting' })
export class ElectoralConfigurationEntity extends BaseTableEntity {
  @Column({ name: 'election_date_start', type: 'timestamp' })
  electionDateStart!: Date;

  @Column({ name: 'election_date_finish', type: 'timestamp' })
  electionDateFinish!: Date;

  @Column({ name: 'time_election', type: 'time' })
  timeElection!: string;

  @Column({ name: 'number_table_elections'})
  numberTableElections!: number;

  @OneToMany(() => PollingTableEntity, pollingTable => pollingTable.electoralConfiguration)
  pollingTables!: PollingTableEntity[];

  @ManyToMany(() => CareerEntity)
  @JoinTable({
    name: 'electoral_configuration_careers',
    joinColumn: { name: 'electoral_configuration_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'career_id', referencedColumnName: 'id' }
  })
  careers!: CareerEntity[];
}
