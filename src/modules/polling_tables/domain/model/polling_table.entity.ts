import { ElectoralConfigurationEntity } from 'src/modules/electoral_configuration/domain/model/electoral_configuration.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('polling_tables', { schema: 'voting' })
export class PollingTableEntity extends BaseTableEntity {
  @Column({ name: 'number_table'})
  numberTable!: number;

  @Column({ name: 'is_open'})
  isOpen!: boolean;

  @Column({ type: 'uuid',  name: 'electoral_configuration_id'})
  electoralConfigurationId!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'date_open'})
  dateOpen!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'date_closed'})
  dateClosed!: Date;

  @ManyToOne(
    () => ElectoralConfigurationEntity,
    (electoralConfiguration) => electoralConfiguration.pollingTables,
  )
  @JoinColumn({ name: 'electoral_configuration_id' })
  electoralConfiguration!: ElectoralConfigurationEntity;
}
