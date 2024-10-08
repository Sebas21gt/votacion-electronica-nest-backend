import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ExpressRequest } from '../types/expressRequest.interface';
import { MessageEnum } from '../enums/message.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException(
      MessageEnum.LOGIN_NOT_AUTORIZED,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
