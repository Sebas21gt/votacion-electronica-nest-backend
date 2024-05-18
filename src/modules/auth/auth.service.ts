import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../users/domain/model/user.entity';
import { StatusEnum } from '../shared/enums/status.enum';
import { sign } from 'jsonwebtoken';
import { MessageEnum } from '../shared/enums/message.enum';
import { MessageResponse } from '../shared/domain/model/message.response';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'password', 'status'],
      where: { username },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    var user = await this.validateUser(loginDto.username, loginDto.password);
    const roles = user.roles.map((role) => role.id);
    user.roles = roles;
    const token = this.generateJwt(user);
    return { access_token: token };
  }

  private generateJwt(user: UserEntity): string {
    return sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME + 's' },
    );
  }

  public async getUserLogin(username: string): Promise<UserEntity> {
    const usuario = await this.userRepository.findOne(
      { username: username },
    );

    if (!usuario) {
      throw new NotFoundException(MessageEnum.ACCESS_INVALID);
    }

    delete usuario.password;
    return usuario;
  }

  public async logout(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      { id: userId, status: StatusEnum.Active }
    );
    if (!user) {
      throw new NotFoundException(MessageEnum.USER_NOT_EXIST);
    }

    delete user.password;
    return user;
  }

   async buildUserResponse(user: UserEntity): Promise<MessageResponse> {

    const messageResponse = new MessageResponse();
    messageResponse.statusCode = HttpStatus.OK;
    messageResponse.message = MessageEnum.ENTITY_SELECT;
    messageResponse.response = {
      ...user,
      token: this.generateJwt(user),
    };

    return messageResponse;
  }

  buildUserResponseLogout(user: UserEntity): any {
    return {
      ...user,
      token: null, 
    };
  }
}
