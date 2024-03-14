import { Request } from 'express';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';

export interface ExpressRequest extends Request {
  user?: UserEntity;
}
