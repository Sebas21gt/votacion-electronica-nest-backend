import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthenticationService } from '../auth.service';
import { ExpressRequest } from 'src/modules/shared/types/expressRequest.interface';
import { GlobalService } from 'src/modules/shared/global.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  usuarioSession: string;
  constructor(private readonly authenticationService: AuthenticationService) { }

  async use(req: ExpressRequest, _: Response, next: NextFunction) {

    req.user = null;    

    if (!req.headers.authorization) {
      next();
      return;
    }
    
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, process.env.JWT_ACCESS_TOKEN);      
      const user = await this.authenticationService.getUserLogin((decode as any).username);    

      req.user = user;
      GlobalService.userSession = user.username;
      next();
    } catch (err) {
      console.log("err", err);
      next();
    }
  }
}