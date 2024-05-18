import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthenticationService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { MessageResponse } from '../shared/domain/model/message.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async logout(@Request() req): Promise<MessageResponse> {
    const userId = req.user.id;
    console.log('userId', userId);
    const user = await this.authService.logout(userId);
    return await this.authService.buildUserResponseLogout(user);
  }

  // @UseGuards(AuthGuard)
  // @Get('/logout/:id')
  // async logout(
  //   @Param('id', ParseIntPipe) usuarioId: string,
  // ): Promise<MessageResponse> {
  //   const usuario = await this.authService.logout(usuarioId);
  //   return await this.authService.buildUserResponseLogout(usuario);
  // }
}
