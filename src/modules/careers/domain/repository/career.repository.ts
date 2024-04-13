import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerEntity } from '../model/career.entity';
import { CareerCreateDto } from '../dto/career_create.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

@Injectable()
export class CareerRepository {
    constructor(
        @InjectRepository(CareerEntity)
        private readonly repository: Repository<CareerEntity>
    ) {}

    async createCareer(careerDto: CareerCreateDto, creator: string): Promise<MessageResponse | CareerEntity> {
        const career = this.repository.create(careerDto);
        career.creationUser = creator;
        // career.updateUser = creator;

        try {
            await this.repository.save(career);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_CREATE,
                "Failed to create career due to an error."
            );
        }
        return career;
    }

    async updateCareer(id: string, careerDto: CareerCreateDto, updater: string): Promise<MessageResponse | CareerEntity> {
        const career = await this.repository.findOne({ where: { id } });
        if (!career) {
            return new MessageResponse(
                HttpStatus.NOT_FOUND,
                MessageEnum.NOT_FOUND,
                "Career not found."
            );
        }
        this.repository.merge(career, careerDto, { updateUser: updater });
        try {
            await this.repository.save(career);
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_UPDATE,
                "Failed to update career due to an error."
            );
        }
        return career;
    }

    async deleteCareer(id: string): Promise<MessageResponse> {
        try {
            const deleteResult = await this.repository.delete(id);
            if (deleteResult.affected === 0) {
                return new MessageResponse(
                    HttpStatus.NOT_FOUND,
                    MessageEnum.NOT_FOUND,
                    "Career not found or already deleted."
                );
            }
        } catch (e) {
            console.error(e);
            return new MessageResponse(
                HttpStatus.BAD_REQUEST,
                MessageEnum.ENTITY_ERROR_DELETE,
                "Failed to delete career due to an error."
            );
        }
        return new MessageResponse(
            HttpStatus.OK,
            MessageEnum.USER_DELETE,
            "Career successfully deleted."
        );
    }
}
