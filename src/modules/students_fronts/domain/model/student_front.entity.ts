import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('students_fronts', { schema: 'voting' })
export class StudentsFrontEntity extends BaseTableEntity {
  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'bytea', nullable: true })
  logo!: Buffer;

  @Column({ name: 'is_habilitated' })
  isHabilitated!: boolean;
}
