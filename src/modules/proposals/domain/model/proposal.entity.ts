import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('proposals', { schema: 'voting' })
export class ProposalsEntity extends BaseTableEntity {
  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @ManyToOne(() => StudentsFrontEntity)
  @JoinColumn({ name: 'student_front_id' })
  studentFront!: StudentsFrontEntity;
}
