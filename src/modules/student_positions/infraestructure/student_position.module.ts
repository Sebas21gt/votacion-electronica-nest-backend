import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentPositionRepository } from '../domain/repository/student_position.repository';
import { StudentPositionController } from './student_position.controller';
import { StudentPositionService } from './student_position.service';
import { StudentPositionEntity } from '../domain/model/student_position.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentPositionEntity ,StudentPositionRepository])
    ],
    controllers: [StudentPositionController],
    providers: [StudentPositionService],
    exports: [StudentPositionService]
})
export class StudentPositionModule {}
