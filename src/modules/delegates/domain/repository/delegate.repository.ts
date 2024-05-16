// src/delegates/delegates.repository.ts
import { EntityRepository, Repository, getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DelegatesEntity } from '../model/delegate.entity';
import { DelegateCreateDto } from '../dto/delegate_create.dto';
import { DelegateUpdateDto } from '../dto/delegate_update.dto';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { GlobalService } from 'src/modules/shared/global.service';

// @Injectable()
@EntityRepository(DelegatesEntity)
export class DelegatesRepository extends Repository<DelegatesEntity> {
  // async createDelegate(dto: DelegateCreateDto): Promise<DelegatesEntity> {
  //     // const delegate = this.create(dto);
  //     // try {
  //     //     await this.save(delegate);
  //     //     return delegate;
  //     // } catch (error) {
  //     //     throw new Error('Failed to create delegate: ' + error.message);
  //     // }
  // }
  async createDelegate(
    dto: DelegateCreateDto,
  ): Promise<DelegatesEntity> {
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
    const delegate = await this.findOne(id);
    if (!delegate) {
      throw new Error('Delegate not found');
    }
    Object.assign(delegate, dto);
    // this.merge(delegate, dto);
    try {
      await this.save(delegate);
      return delegate;
    } catch (error) {
      throw new Error('Failed to update delegate: ' + error.message);
    }
  }

  async findAllDelegates(): Promise<DelegatesEntity[]> {
    try {
      return await this.find(); // Retrieving all delegates
    } catch (error) {
      throw new Error('Failed to retrieve delegates: ' + error.message);
    }
  }

  async findDelegateById(id: string): Promise<DelegatesEntity> {
    try {
      const delegate = await this.findOne(id);
      if (!delegate) {
        throw new Error('Delegate not found');
      }
      return delegate;
    } catch (error) {
      throw new Error('Failed to retrieve delegate: ' + error.message);
    }
  }

  async deleteDelegate(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No delegate found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete delegate: ' + error.message);
    }
  }
}
