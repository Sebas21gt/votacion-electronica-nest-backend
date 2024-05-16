import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { FacultyEntity } from '../model/faculty.entity';
import { FacultyCreateDto } from '../dto/faculty_create.dto';
import { FacultyUpdateDto } from '../dto/faculty_update.dto';

@EntityRepository(FacultyEntity)
export class FacultyRepository extends Repository<FacultyEntity> {
  async createFaculty(
    facultyDto: FacultyCreateDto,
  ): Promise<FacultyEntity | MessageResponse> {
    const faculty = new FacultyEntity();
    faculty.name = facultyDto.name;
    faculty.address = facultyDto.address;

    try {
      return await this.save(faculty);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create faculty.',
      );
    }
  }

  async updateFaculty(
    id: string,
    facultyDto: FacultyUpdateDto,
  ): Promise<FacultyEntity | MessageResponse> {
    try {
      const result = await this.update(id, facultyDto);
      if (result.affected === 0) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          `Faculty with ID ${id} not found.`,
        );
      }
      return await this.findOne(id);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_UPDATE,
        'Failed to update faculty.',
      );
    }
  }

  async findOneFaculty(id: string): Promise<FacultyEntity | MessageResponse> {
    try {
      const faculty = await this.findOne(id, { relations: ['careers'] });
      if (!faculty) {
        return new MessageResponse(
          HttpStatus.NOT_FOUND,
          MessageEnum.NOT_FOUND,
          `Faculty with ID ${id} not found.`,
        );
      }
      return faculty;
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve faculty.',
      );
    }
  }

  async findAllFaculties(): Promise<FacultyEntity[] | MessageResponse> {
    try {
      return await this.find({ relations: ['careers'] });
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_RETRIEVE,
        'Failed to retrieve faculties.',
      );
    }
  }
}
