import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { BaseTableEntity } from 'src/modules/shared/domain/model/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('faculties', { schema: 'voting' })
export class FacultyEntity extends BaseTableEntity {
    @Column({ length: 120 })
    name!: string;

    @Column({ length: 500 })
    address!: string;

    @OneToMany(() => CareerEntity, career => career.faculty)
    careers!: CareerEntity[];
}
