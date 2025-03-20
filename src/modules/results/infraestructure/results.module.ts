import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { ResultsRepository } from '../domain/repository/result.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ResultsRepository])],
    controllers: [ResultsController],
    providers: [ResultsService],
    exports: [ResultsService],
})
export class ResultsModule {}
