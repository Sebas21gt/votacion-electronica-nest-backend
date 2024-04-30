import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentPositionCreateDto } from '../domain/dto/student_position_create.dto';
import { StudentPositionUpdateDto } from '../domain/dto/student_position_update.dto';
import { StudentPositionRepository } from '../domain/repository/student_position.repository';


@Injectable()
export class StudentPositionService {
    constructor(
        @InjectRepository(StudentPositionRepository)
        private positionRepository: StudentPositionRepository
    ) {}

    findAll() {
        return this.positionRepository.findAllPositions();
    }

    findOne(id: string) {
        return this.positionRepository.findOnePosition(id);
    }

    create(dto: StudentPositionCreateDto) {
        return this.positionRepository.createPosition(dto);
    }

    update(id: string, dto: StudentPositionUpdateDto) {
        return this.positionRepository.updatePosition(id, dto);
    }

    remove(id: string) {
        return this.positionRepository.deletePosition(id);
    }
}
