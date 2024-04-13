import { Controller, Post, Body, Get, Param, Put, ValidationPipe, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { UserEntity } from '../domain/model/user.entity';

@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/create-user')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() userDto: UserCreateDto): Promise<UserEntity | object> {
        return await this.userService.userCreate(userDto, 'Admin');
    }

    // @Get(':id')
    // async getUser(@Param('id') id: string): Promise<UserEntity | object> {
    //     return await this.userService.getUserById(id);
    // }

    // @Get('/get-all')
    // async getAllUsers(): Promise<UserEntity | object> {
    //     return await this.userService.getAllUsers();
    // }

    // @Put(':id')
    // async updateUser(@Param('id') id: string, @Body() userDto: UserCreateDto): Promise<UserEntity | object> {
    //     return await this.userService.updateUser(id, userDto, 'Admin');
    // }
}
