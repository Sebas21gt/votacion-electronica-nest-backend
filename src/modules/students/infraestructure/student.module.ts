import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from '../domain/repository/student.repository';
import { StudentController } from './student.controller';
import { StudentService } from './Student.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([StudentRepository])
    ],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService]
})
export class StudentModule {}
