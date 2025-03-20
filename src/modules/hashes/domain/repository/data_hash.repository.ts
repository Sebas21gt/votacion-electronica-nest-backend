import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { DataHashEntity } from '../model/data_hash.entity';
import { DataHashCreateDto } from '../dto/create.dto';
import { json } from 'stream/consumers';

@EntityRepository(DataHashEntity)
export class DataHashRepository extends Repository<DataHashEntity> {

  async createDataHash(
    transaction: any,
    dto: DataHashCreateDto,
  ): Promise<DataHashEntity | MessageResponse> {
    try {
      const dataHash = new DataHashEntity();
      Object.assign(dataHash, dto);

      dataHash.signature = JSON.stringify(dto.signature);

      return await transaction.save(dataHash);
    } catch (error) {
      console.error(error);
      return new MessageResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MessageEnum.ENTITY_ERROR_CREATE,
        'Failed to create the data hash.',
      );
    }
  }
}
