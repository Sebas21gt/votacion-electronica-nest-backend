import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserEntity } from 'src/modules/users/domain/model/user.entity';
import { LoginDto } from '../domain/dto/login.dto';
import { MessageResponse } from 'src/modules/shared/domain/model/message.response';
import { MessageEnum } from 'src/modules/shared/enums/message.enum';
import { StatusEnum } from 'src/modules/shared/enums/status.enum';

@Injectable()
export class AuthService {
	constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,    
  ) { }
  
  async authGenerate(loginDto:LoginDto): Promise<any> {
		const user = await this.userRepository.findOne({
		where: {
      email: loginDto.email,
      status: StatusEnum.Active
    },
		});

		if (!user){
			return new MessageResponse(HttpStatus.INTERNAL_SERVER_ERROR, MessageEnum.USER_NOT_EXIST, null);
		}

    const isCorrect = await compare(loginDto.password, user.password);

    if (!isCorrect) {
      return new MessageResponse(HttpStatus.UNPROCESSABLE_ENTITY, MessageEnum.CREDENTIALS_INVALID, null);
    }
    delete user.password;
		return new MessageResponse(HttpStatus.OK, MessageEnum.ENTITY_SELECT, user);
  }

  private generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        roles: ['admin']
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME + 's' },
    );
  }

  async buildUserResponse(user: UserEntity): Promise<MessageResponse> {

    const messageResponse = new MessageResponse();
    messageResponse.statusCode = HttpStatus.OK;
    messageResponse.message = MessageEnum.ENTITY_SELECT;
    messageResponse.data = {
      ...user,
      token: this.generateJwt(user),
    };

    return messageResponse;
  }
}