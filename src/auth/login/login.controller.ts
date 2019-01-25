import { Controller, Post, Body, Get, HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto, UserLoginDto } from 'src/models/user';
import { User } from '../entities/user.entity';
import { ResponseService } from '../services/response.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  @Post()
  async login(@Body() user: UserLoginDto): Promise<User | HttpException> {
    const userFound = await this.userService.loginUser(user);
    if (userFound)
      return userFound;
    else
      return this.responseService.badLogin();
  }

  @Get()
  async users(): Promise<User[]> {
    return this.userService.all();
  }
}
