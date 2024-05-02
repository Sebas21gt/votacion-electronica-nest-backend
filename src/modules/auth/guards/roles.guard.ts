import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtHelper } from '../helper/jwt.helper';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';

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
    console.log("token: ",token);
    const userRoles = await JwtHelper.getUserRoles(token);
    console.log("Roles: ",userRoles);
    const userRolesMatch = roles.some(roles => userRoles.includes(roles));
    console.log("Roles Match: ", roles);
    if (!userRolesMatch) {
      throw new HttpException(MessageEnum.USER_HAS_NOT_ROLES, HttpStatus.UNAUTHORIZED);
    }

    return userRolesMatch;
  }
}
