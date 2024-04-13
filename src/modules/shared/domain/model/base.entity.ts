import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

export class BaseTableEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'creation_user' })
  creationUser!: string;

  @Column({ name: 'update_user' })
  updateUser?: string;

  @CreateDateColumn({ name: 'creation_time', default: new Date() })
  dateCreation!: Timestamp;

  @UpdateDateColumn({ name: 'update_time' })
  dateUpdate?: Timestamp;

  @Column()
  status!: number;
}
