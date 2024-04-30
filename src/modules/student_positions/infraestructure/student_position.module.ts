import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentPositionController } from './student_position.controller';
import { StudentPositionService } from './student_position.service';
import { StudentPositionEntity } from '../domain/model/student_position.entity';
import { StudentPositionRepository } from '../domain/repository/student_position.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentPositionEntity ,StudentPositionRepository])
    ],
    controllers: [StudentPositionController],
    providers: [StudentPositionService],
    exports: [StudentPositionService]
})
export class StudentPositionModule {}
