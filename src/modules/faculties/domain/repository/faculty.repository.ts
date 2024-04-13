import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from '../model/faculty.entity';
import { FacultyCreateDto } from '../dto/faculty_create.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class FacultyRepository {
    constructor(
        @InjectRepository(FacultyEntity)
        private readonly repository: Repository<FacultyEntity>
    ) {}

    async createFaculty(
        facultyDto: FacultyCreateDto,
        creator: string
    ): Promise<MessageResponse | FacultyEntity> {
        const faculty = this.repository.create(facultyDto);
        faculty.creationUser = creator;
        // faculty.updateUser = creator;

        try {
            await this.repository.save(faculty);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_CREATE,
                "Failed to create faculty due to an error."
            );
        }
        return faculty;
    }

    async updateFaculty(
        id: string,
        facultyDto: FacultyCreateDto,
        updater: string
    ): Promise<MessageResponse | FacultyEntity> {
        const faculty = await this.repository.findOne({ where: { id } });
        if (!faculty) {
            return new MessageResponse(
                HttpStatus.NOT_FOUND,
                MessageEnum.NOT_FOUND,
                "Faculty not found."
            );
        }
        this.repository.merge(faculty, facultyDto, { updateUser: updater });
        try {
            await this.repository.save(faculty);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_UPDATE,
                "Failed to update faculty due to an error."
            );
        }
        return faculty;
    }

    async deleteFaculty(id: string): Promise<MessageResponse> {
        try {
            const deleteResult = await this.repository.delete(id);
            if (deleteResult.affected === 0) {
                return new MessageResponse(
                    HttpStatus.NOT_FOUND,
                    MessageEnum.NOT_FOUND,
                    "Faculty not found or already deleted."
                );
            }
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_DELETE,
                "Failed to delete faculty due to an error."
            );
        }
        return new MessageResponse(
            HttpStatus.OK,
            MessageEnum.USER_DELETE,
            "Faculty successfully deleted."
        );
    }
}
