import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { JwtHelper } from 'src/modules/shared/helpers/jwt.helpers';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const userRoles = await JwtHelper.getUserRoles(token);
    const userRolesMatch = roles.some(roles => userRoles.includes(roles));
    if (!userRolesMatch) {
      throw new HttpException(MessageEnum.USER_HAS_NOT_ROLES, HttpStatus.UNAUTHORIZED);
    }

    return userRolesMatch;
  }
}
