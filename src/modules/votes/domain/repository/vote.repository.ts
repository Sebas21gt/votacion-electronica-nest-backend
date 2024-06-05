import { EntityRepository, Repository } from 'typeorm';
import { VoteCreateDto } from '../dto/vote_create.dto';
import { VotesEntity } from '../model/vote.entity';
import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';
import { StudentEntity } from 'src/modules/students/domain/model/student.entity';
import { StudentsFrontEntity } from 'src/modules/students_fronts/domain/model/student_front.entity';
import { ResultsEntity } from 'src/modules/results/domain/model/result.entity';

@EntityRepository(VotesEntity)
export class VotesRepository extends Repository<VotesEntity> {

  async createVote(dto: VoteCreateDto, userId: string): Promise<boolean> {
    const user = await this.manager.findOne(UserEntity, {
      where: { id: userId, status: StatusEnum.Active },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const student = await this.manager.findOne(StudentEntity, {
      userId: user.id,
      status: StatusEnum.Active,
    });
    if (!student) {
      throw new HttpException('Student not found.', HttpStatus.NOT_FOUND);
    }
    
    
    if (!student.isHabilitated) {
      throw new HttpException('Student not habilitated.', HttpStatus.BAD_REQUEST);
    }
    
    if (student.isVoted) {
      throw new HttpException('Student already voted.', HttpStatus.BAD_REQUEST);
    }

    student.isVoted = true;
    student.signature = 'data:image/png;base64,' + dto.signature;
    // student.signature = dto.signature;
    await this.manager.update(StudentEntity, student.id, student);
    
    const fronts = await this.manager.find(StudentsFrontEntity, {
      where: { status: StatusEnum.Active },
    });
    
    
    //TODO: HASHEAR EL ID Y COMPARAR CON EL VOTEFRONTID
    const frontId = fronts.find((front) => front.id === dto.voteFrontId);
    
    if (!frontId) {
      throw new HttpException('Front not found.', HttpStatus.NOT_FOUND);
    }

    const resultId = await this.manager.findOne(ResultsEntity, {
      where: { studentFrontId: frontId, status: StatusEnum.Active },
    });

    if (!resultId) {
      //TODO: CAMBIAR LOS ERRORES A HTTP EXCEPTIONS
      throw new HttpException('Result not found.', HttpStatus.NOT_FOUND);
    }

    resultId.votes = resultId.votes + 1;
    await this.manager.update(ResultsEntity, resultId.id, resultId);
    return true;
  }

  async findAllVotes(): Promise<VotesEntity[]> {
    try {
      return await this.find({ relations: ['student', 'pollingTable'] });
    } catch (error) {
      throw new Error('Failed to retrieve votes: ' + error.message);
    }
  }

  async findVoteById(id: string): Promise<VotesEntity> {
    try {
      const vote = await this.findOne(id, {
        relations: ['student', 'pollingTable'],
      });
      if (!vote) {
        throw new Error('Vote not found');
      }
      return vote;
    } catch (error) {
      throw new Error('Failed to retrieve vote: ' + error.message);
    }
  }

  async deleteVote(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error('No vote found to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete vote: ' + error.message);
    }
  }
}
