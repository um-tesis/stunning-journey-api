import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { LogInModelIn } from './dto/auth-input';
import { CreateUserInput } from './dto/create-user.input';
import { UsersResolver } from './users.resolver';

@Controller('users')
export class UsersController {
  constructor(private usersResolver: UsersResolver) {}

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.usersResolver.findAll();
    return res.status(HttpStatus.OK).json({ users });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserInput) {
    const user = await this.usersResolver.createUser(createUserDto);
    return user;
  }

  @Get('/auth')
  async login(@Body() login: CreateUserInput) {
    console.log('REPO TEST');
    // const loginModel = login as LogInModelIn;
    throw new Error('Not implemented');
  }

  @Get(':id')
  async findOne(@Param() params) {
    const user = await this.usersResolver.findOne(+params.id);
    return user;
  }
}
