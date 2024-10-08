import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from '../domain/dto/login.dto';

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async authGenerate(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<any> {
    console.log(loginDto);
    const response = await this.authService.authGenerate(loginDto);
    console.log(response.statusCode);
    if (response.statusCode != HttpStatus.OK) {
      console.log('Estatus code:');
      console.log(response.statusCode);
      // return response;
      return res.status(response.statusCode).json(response);
    }
    return res
      .status(HttpStatus.OK)
      .header('Custom-Header', 'Value')
      .json(await this.authService.buildUserResponse(response.data));
  }
}
