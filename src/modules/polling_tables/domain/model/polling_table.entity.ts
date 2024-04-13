import { ElectoralConfigurationEntity } from 'src/modules/electoral_configuration/domain/model/electoral_configuration.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('polling_tables', { schema: 'voting' })
export class PollingTableEntity extends BaseTableEntity {
  @Column()
  numberTable!: number;

  @Column()
  isOpen!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dateOpen!: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateClosed!: Date;

  @ManyToOne(
    () => ElectoralConfigurationEntity,
    (electoralConfiguration) => electoralConfiguration.pollingTables,
  )
  @JoinColumn({ name: 'electoral_configuration_id' })
  electoralConfiguration!: ElectoralConfigurationEntity;
}
