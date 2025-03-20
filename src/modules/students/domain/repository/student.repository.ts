import { EntityRepository, Repository, getManager } from 'typeorm';
import { StudentEntity } from '../model/student.entity';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudentCreateDto } from '../dto/student_create.dto';
import { StudentUpdateDto } from '../dto/student_update.dto';
import { RolesEnum } from 'src/modules/shared/enums/roles.enum';
import { RoleEntity } from 'src/modules/roles/domain/model/role.entity';
import { GlobalService } from 'src/modules/shared/global.service';
import { CareerEntity } from 'src/modules/careers/domain/model/career.entity';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { keccak256, toUtf8Bytes } from 'ethers';

@EntityRepository(StudentEntity)
export class StudentRepository extends Repository<StudentEntity> {
  async createStudentWithUser(
    transaction: any,
    studentDto: StudentCreateDto,
  ): Promise<StudentEntity> {
    const user = new UserEntity();
    user.username = studentDto.ciNumber;
    user.password = studentDto.ciNumber;

    const student = new StudentEntity();
    student.fullname = studentDto.fullname;
    student.collegeNumber = studentDto.collegeNumber;
    student.ciNumber = studentDto.ciNumber;
    student.isHabilitated = false;
    student.isVoted = false;
    student.totalAuthorizations = 0;
    student.user = user;
    student.careers = [];

    const role = await getManager().findOne(RoleEntity, {
      where: { id: RolesEnum.STUDENT },
    });

    if (!role) {
      throw new Error('Role not found for students.');
    }

    user.roles = [role];

    const careerPrefix = student.collegeNumber.split('-')[0];
    const career = await transaction.findOne(CareerEntity, {
      where: { collegeId: parseInt(careerPrefix) },
    });

    if (career) {
      if (!student.careers.some((c) => c.id === career.id)) {
        student.careers.push(career); // Añadir la carrera si no está ya asociada
      }
    } else {
      console.error('Career not found for prefix:', careerPrefix);
    }

    try {
      // await getManager().transaction(async (transactionalEntityManager) => {
      await transaction.save(user);
      student.user = user;
      await transaction.save(student);
      // });
      return student;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create student and user.',
      );
    }
  }

  async findAllStudents(): Promise<any[]> {
    try {
      const students = await this.find({
        relations: ['careers'],
        where: { status: StatusEnum.Active },
      });

      return students.map((student) => ({
        ...student,
        careers: student.careers.map((career) => career.name), // Extracting career names
      }));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to retrieve all students.',
      );
    }
  }

  async findOneStudent(id: string): Promise<any> {
    const user = await this.manager.findOne(UserEntity, {
      where: { id: id },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found.');
    }

    let student = await this.findOne({
      where: { userId: user.id, status: StatusEnum.Active },
      relations: ['careers'],
    });

    if (!student) {
      throw new HttpException('Student not found.', HttpStatus.NOT_FOUND);
    }

    const signature = student.signature ? '' + student.signature : null;

    student.signature = signature;

    const studentDto = {
      ...student,
      careers: student.careers.map((career) => career.name), // Solo nombres de las carreras
    };

    return studentDto;
  }

  async enableStudent(
    id: string,
    totalFronts: number,
    pollingTableId: string,
  ): Promise<StudentEntity> {
    try {
      const user = await this.manager.findOne(UserEntity, {
        where: { id: id },
      });

      if (!user) {
        throw new InternalServerErrorException('User not found.');
      }

      const student = await this.findOne({
        userId: user.id,
        status: StatusEnum.Active,
      });
      if (!student) {
        throw new InternalServerErrorException('Student not found.');
      }

      if (student.isVoted) {
        throw new InternalServerErrorException('Student already voted.');
      }

      if (totalFronts < 2) {
        student.isHabilitated = true;
      } else {
        student.totalAuthorizations++;
        if (student.totalAuthorizations === 2) {
          student.isHabilitated = true;
        }
      }

      student.pollingTableId = pollingTableId;

      return await this.save(student);
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
      const student = await this.findOne(id, { relations: ['user'] });
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
      if (studentDto.userId !== undefined) {
        const user = new UserEntity();
        user.id = studentDto.userId;
        student.user = user;
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

  async importStudentsFromExcel(transaction: any, data: any): Promise<any> {
    const errorStudents: StudentEntity[] = [];
    let hashStudents: string[] = [];

    const role = await transaction.findOne(RoleEntity, {
      where: { id: RolesEnum.STUDENT },
    });
    if (!role) {
      throw new Error('Role not found for students.');
    }

    for (const item of data) {
      let user = await transaction.findOne(UserEntity, {
        where: { username: item.CI },
      });

      if (!user) {
        user = transaction.create(UserEntity, {
          username: item.CI,
          password: item.CI,
          roles: [role],
        });
        await transaction.save(user);
      }

      let student = await transaction.findOne(StudentEntity, {
        where: { user: user.id },
        relations: ['careers'],
      });

      if (!student) {
        student = transaction.create(StudentEntity, {
          fullname: item['APELLIDOS Y NOMBRES'],
          collegeNumber: item.CU,
          ciNumber: item.CI,
          isHabilitated: false,
          isVoted: false,
          totalAuthorizations: 0,
          user: user,
        });
        student.careers = [];
      }

      const careerPrefix = item.CU.split('-')[0];
      const career = await transaction.findOne(CareerEntity, {
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
        await transaction.save(student);
        const hash = keccak256(toUtf8Bytes(student.id));
        hashStudents.push(hash);
      } catch (error) {
        console.error('Failed to save student:', error);
        errorStudents.push(student);
      }
    }

    return { errorStudents, hashStudents };
  }
}
