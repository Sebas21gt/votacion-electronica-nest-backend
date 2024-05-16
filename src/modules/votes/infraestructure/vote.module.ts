import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesRepository } from '../domain/repository/vote.repository';
import { VotesController } from './vote.controller';
import { VotesService } from './vote.service';

@Module({
    imports: [TypeOrmModule.forFeature([VotesRepository])],
    controllers: [VotesController],
    providers: [VotesService],
    exports: [VotesService],
})
export class VotesModule {}
