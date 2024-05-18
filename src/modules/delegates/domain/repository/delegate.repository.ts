import { EntityRepository, Repository, getManager } from 'typeorm';
import { DelegatesEntity } from '../model/delegate.entity';
import { DelegateCreateDto } from '../dto/delegate_create.dto';
import { DelegateUpdateDto } from '../dto/delegate_update.dto';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { HttpStatus } from '@nestjs/common';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@EntityRepository(DelegatesEntity)
export class DelegatesRepository extends Repository<DelegatesEntity> {
  async createDelegate(dto: DelegateCreateDto): Promise<DelegatesEntity> {
    const delegate = new DelegatesEntity();
    Object.assign(delegate, dto);

    await getManager().transaction(async (transactionalEntityManager) => {
      const student = await transactionalEntityManager.findOne(StudentEntity, {
        where: { id: dto.studentId },
        relations: ['user'],
      });
      if (!student) {
        throw new Error('Student not found for delegate creation.');
      }
      if (!student.user) {
        throw new Error('User associated with the student not found.');
      }

      const role = await transactionalEntityManager.findOne(RoleEntity, {
        where: { id: RolesEnum.DELEGATE },
      });

      if (!role) {
        throw new Error('Role DELEGATE not found.');
      }

      const user = await transactionalEntityManager.findOne(UserEntity, {
        where: { id: student.user.id },
        relations: ['roles'],
      });

      user.roles = [...user.roles, role];

      await transactionalEntityManager.save(UserEntity, user);

      await transactionalEntityManager.save(DelegatesEntity, delegate);
    });

    return delegate;
  }

  async updateDelegate(
    id: string,
    dto: DelegateUpdateDto,
  ): Promise<DelegatesEntity> {
    const delegate = await this.findOne(id, {
      where: { status: StatusEnum.Active },
    });
    if (!delegate) {
      throw new Error('Delegate not found');
    }
    Object.assign(delegate, dto);
    try {
      await this.save(delegate);
      return delegate;
    } catch (error) {
      throw new Error('Failed to update delegate: ' + error.message);
    }
  }

  async findAllDelegates(): Promise<any[]> {
    try {
      return await this.createQueryBuilder('delegate')
        .leftJoinAndSelect('delegate.student', 'student')
        .leftJoinAndSelect('delegate.pollingTable', 'pollingTable')
        .leftJoinAndSelect('delegate.studentFront', 'studentFront')
        .select([
          'delegate.id',
          'student.fullname AS studentName',
          'student.ciNumber AS studentCI',
          'studentFront.name AS studentFrontName',
          'pollingTable.numberTable AS pollingTableNumber',
        ])
        .where('delegate.status = :status', { status: StatusEnum.Active })
        .getRawMany();
    } catch (error) {
      console.error('Failed to retrieve detailed delegates:', error);
      throw new Error(
        'Failed to retrieve detailed delegates: ' + error.message,
      );
    }
  }

  async findDelegateById(id: string): Promise<any> {
    try {
      const delegate = await this.createQueryBuilder('delegate')
        .leftJoinAndSelect('delegate.student', 'student')
        .leftJoinAndSelect('delegate.pollingTable', 'pollingTable')
        .leftJoinAndSelect('delegate.studentFront', 'studentFront')
        .select([
          'delegate.id',
          'student.fullname AS studentName',
          'student.ciNumber AS studentCI',
          'studentFront.name AS studentFrontName',
          'pollingTable.numberTable AS pollingTableNumber',
        ])
        .where('delegate.id = :id', { id })
        .andWhere('delegate.status = :status', { status: StatusEnum.Active })
        .getRawOne();

      if (!delegate) {
        return new MessageResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          MessageEnum.DELEGATE_ERROR_NOT_FOUND,
          'Failed to retrieve delegate.',
        );
      }
      return delegate;
    } catch (error) {
      console.error('Failed to retrieve delegate:', error);
      throw new Error('Failed to retrieve delegate: ' + error.message);
    }
  }

  async deleteDelegate(id: string): Promise<void> {
    const delegate = await this.findOne(id);
    if (!delegate) {
      throw new Error('Delegate not found');
    }

    delegate.status = StatusEnum.Deleted;
    try {
      await this.save(delegate);
    } catch (error) {
      console.error('Failed to delete delegate logically:', error);
      throw new Error('Failed to delete delegate logically: ' + error.message);
    }
  }
}
