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
import { CreateUserInput } from './dto/create-user.input';
import { UsersResolver } from './users.resolver';

@Controller('users')
export class UsersController {
  constructor(private usersResolver: UsersResolver) {}

  @Get()
  findAll(@Res() res: Response) {
    console.log(res.json);
    res.status(HttpStatus.OK).json([]);
  }

  @Post()
  create(@Body() createUserDto: CreateUserInput) {
    const user = this.usersResolver.createUser(createUserDto);
    return user;
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} user`;
  }
}
