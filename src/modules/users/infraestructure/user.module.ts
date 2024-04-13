import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../domain/model/user.entity';
import { UserRepository } from '../domain/repository/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserRepository])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
