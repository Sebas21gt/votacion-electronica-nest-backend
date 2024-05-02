import { EntityRepository, Repository } from 'typeorm';
import { StudentEntity } from '../model/student.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcryptjs';
import { StudentCreateDto } from '../dto/student_create.dto';
import { StudentUpdateDto } from '../dto/student_update.dto';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
import { GlobalService } from 'src/modules/shared/global.service';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';

@EntityRepository(StudentEntity)
export class StudentRepository extends Repository<StudentEntity> {
  async createStudentWithUser(
    studentDto: StudentCreateDto,
  ): Promise<StudentEntity> {
    const user = new UserEntity();
    user.creationUser = 'admin';
    user.username = studentDto.collegeNumber;
    user.password = await bcrypt.hash(studentDto.ciNumber, 10);

    const student = new StudentEntity();
    student.fullname = studentDto.fullname;
    student.collegeNumber = studentDto.collegeNumber;
    student.ciNumber = studentDto.ciNumber;
    student.isHabilitated = studentDto.isHabilitated;
    student.creationUser = 'admin';
    student.userId = user;

    try {
      await this.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(user);
        student.userId = user;
        await transactionalEntityManager.save(student);
      });
      return student;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create student and user.',
      );
    }
  }

  async findAllStudents(): Promise<StudentEntity[]> {
    try {
      return await this.find({ relations: ['userId', 'careers'] });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to retrieve all students.',
      );
    }
  }

  async findOneStudent(id: string): Promise<StudentEntity> {
    try {
      const student = await this.findOne(id, {
        relations: ['userId', 'careers'],
      });
      if (!student) {
        throw new InternalServerErrorException('Student not found.');
      }
      return student;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to retrieve student.');
    }
  }

  async updateStudent(
    id: string,
    studentDto: StudentUpdateDto,
  ): Promise<StudentEntity> {
    try {
      const student = await this.findOne(id, { relations: ['userId'] });
      if (!student) {
        throw new InternalServerErrorException('Student not found.');
      }

      if (studentDto.fullname !== undefined) {
        student.fullname = studentDto.fullname;
      }
      if (studentDto.collegeNumber !== undefined) {
        student.collegeNumber = studentDto.collegeNumber;
      }
      if (studentDto.ciNumber !== undefined) {
        student.ciNumber = studentDto.ciNumber;
      }
      if (studentDto.isHabilitated !== undefined) {
        student.isHabilitated = studentDto.isHabilitated;
      }
      if (studentDto.userId !== undefined) {
        const user = new UserEntity();
        user.id = studentDto.userId;
        student.userId = user;
      }

      await this.save(student);
      return student;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update student.');
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      const deleteResult = await this.delete(id);
      if (deleteResult.affected === 0) {
        throw new InternalServerErrorException('Student not found.');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete student.');
    }
  }

  async importStudentsFromExcel(data: any): Promise<StudentEntity[]> {
    const errorStudents: StudentEntity[] = [];

    await this.manager.transaction(async (transactionalEntityManager) => {
      const role = await transactionalEntityManager.findOne(RoleEntity, {
        where: { id: RolesEnum.STUDENT },
      });
      if (!role) {
        throw new Error('Role not found for students.');
      }

      for (const item of data) {
        let user = await transactionalEntityManager.findOne(UserEntity, {
          where: { username: item.CI },
        });

        if (!user) {
          user = transactionalEntityManager.create(UserEntity, {
            username: item.CI,
            password: item.CI,
            creationUser: 'admin',
            roles: [role],
          });
          await transactionalEntityManager.save(user);
        }

        let student = await transactionalEntityManager.findOne(StudentEntity, {
          where: { userId: user.id },
          relations: ['careers'],
        });

        if (!student) {
          student = transactionalEntityManager.create(StudentEntity, {
            fullname: item['APELLIDOS Y NOMBRES'],
            collegeNumber: item.CU,
            ciNumber: item.CI,
            isHabilitated: true,
            creationUser: 'admin',
            userId: user,
          });
          student.careers = [];
        }

        const careerPrefix = item.CU.split('-')[0];
        const career = await transactionalEntityManager.findOne(CareerEntity, {
          where: { collegeId: parseInt(careerPrefix) },
        });

        if (career) {
          if (!student.careers.some((c) => c.id === career.id)) {
            student.careers.push(career); // Añadir la carrera si no está ya asociada
          }
        } else {
          console.error('Career not found for prefix:', careerPrefix);
          errorStudents.push(item);
        }

        try {
          await transactionalEntityManager.save(student); // Guardar el estudiante con las carreras actualizadas
        } catch (error) {
          console.error('Failed to save student:', error);
          errorStudents.push(student);
        }
      }
    });

    return errorStudents;
  }
}
