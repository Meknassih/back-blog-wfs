import { Controller, Post, Body, Get, HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto, UserLoginDto } from 'src/models/user';
import { User } from '../entities/user.entity';
import { ResponseService } from '../services/response.service';

/**
 * Handles login operations
 * @constructs LoginController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@Controller('login')
export class LoginController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  /**
   * Handles a user that wants to log in
   * @async
   * @function login
   * @param {UserLoginDto} user user data to check against the DB
   * @returns {Promise<(User|HttpException)>} returns the user logged in or an exception if authentication fails
   */
  @Post()
  async login(@Body() user: UserLoginDto): Promise<User | HttpException> {
    const userFound = await this.userService.loginUser(user);
    if (userFound)
      return userFound;
    else
      return this.responseService.badLogin();
  }
}
